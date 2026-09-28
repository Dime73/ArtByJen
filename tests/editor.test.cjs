const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function editorContext() {
  const element = () => ({
    disabled: false,
    value: '',
    addEventListener() {},
    querySelector() { return element(); }
  });
  const context = vm.createContext({
    document: {
      querySelector: element,
      querySelectorAll: () => []
    },
    window: { addEventListener() {} },
    structuredClone,
    crypto: require('node:crypto').webcrypto,
    URL,
    setTimeout,
    clearTimeout
  });
  const source = fs.readFileSync(path.join(__dirname, '..', 'admin', 'editor.js'), 'utf8');
  vm.runInContext(source, context);
  vm.runInContext(`
    sections = {
      hero: { title: 'Art by Jen.', subtitle: 'Color and form' },
      about: { section_title: 'About', paragraph1: 'First', paragraph2: 'Second' },
      contact: { section_title: 'Contact', description: 'Say hello', email: 'jen@example.com' }
    };
    originalSections = structuredClone(sections);
    artworks = [{ _id: 'one', filename: 'first', title: 'First', medium: 'Oil', image: 'images/first.webp', alt: 'Blue painting', order: 1, sample: false }];
    originalArtworks = new Map(artworks.map(item => [item._id, cleanArtwork(item)]));
    originalIndex = ['first.json'];
    head = 'old-head';
    treeSha = 'old-tree';
    uploads = new Map();
  `, context);
  return context;
}

test('gallery entries and the index change together', () => {
  const context = editorContext();
  assert.equal(vm.runInContext('collectChanges().length', context), 0);
  vm.runInContext(`
    artworks.push({ _id: 'two', filename: 'second', title: 'Second', medium: 'Ink', image: 'images/second.webp', alt: 'Red drawing', order: 0, sample: false });
  `, context);
  const changes = vm.runInContext('collectChanges()', context);
  assert.deepEqual(Array.from(changes, change => change.path).sort(), [
    'content/gallery-index.json',
    'content/gallery/second.json'
  ]);
  const index = JSON.parse(changes.find(change => change.path === 'content/gallery-index.json').content);
  assert.deepEqual(Array.from(index.files), ['second.json', 'first.json']);
});

test('removing artwork deletes its metadata and updates the index', () => {
  const context = editorContext();
  vm.runInContext('artworks = []', context);
  const changes = vm.runInContext('collectChanges()', context);
  assert.equal(changes.find(change => change.path === 'content/gallery/first.json').sha, null);
  assert.deepEqual(Array.from(JSON.parse(changes.find(change => change.path === 'content/gallery-index.json').content).files), []);
});

test('publish creates one commit with the gallery and index changes', async () => {
  const context = editorContext();
  const calls = [];
  context.mockRequest = async (route, options = {}) => {
    calls.push({ route, options });
    if (route === '/git/ref/heads/main') return { object: { sha: 'old-head' } };
    if (route === '/git/trees') return { sha: 'new-tree' };
    if (route === '/git/commits') return { sha: 'new-commit' };
    if (route === '/git/refs/heads/main') return {};
    throw new Error(`Unexpected route: ${route}`);
  };
  vm.runInContext(`
    artworks.push({ _id: 'two', filename: 'second', title: 'Second', medium: 'Ink', image: 'images/second.webp', alt: 'Red drawing', order: 2, sample: false });
    request = mockRequest;
    loadContent = async () => {};
    notify = () => {};
  `, context);
  await vm.runInContext('publish()', context);
  const tree = JSON.parse(calls.find(call => call.route === '/git/trees').options.body);
  assert.equal(tree.base_tree, 'old-tree');
  assert.deepEqual(Array.from(tree.tree, entry => entry.path).sort(), ['content/gallery-index.json', 'content/gallery/second.json']);
  const commit = JSON.parse(calls.find(call => call.route === '/git/commits').options.body);
  assert.deepEqual(Array.from(commit.parents), ['old-head']);
  const ref = JSON.parse(calls.find(call => call.route === '/git/refs/heads/main').options.body);
  assert.deepEqual(ref, { sha: 'new-commit', force: false });
});

test('publish stops when the repository has changed', async () => {
  const context = editorContext();
  const calls = [];
  context.mockRequest = async route => {
    calls.push(route);
    return { object: { sha: 'someone-elses-commit' } };
  };
  let message = '';
  context.captureMessage = value => { message = value; };
  vm.runInContext(`
    sections.hero.subtitle = 'Edited';
    request = mockRequest;
    notify = captureMessage;
  `, context);
  await vm.runInContext('publish()', context);
  assert.deepEqual(calls, ['/git/ref/heads/main']);
  assert.match(message, /repository changed/);
});
