const REPO = 'Dime73/ArtByJen';
const API = `https://api.github.com/repos/${REPO}`;
const SECTION_FIELDS = {
  hero: [
    ['title', 'Title', 'text'],
    ['subtitle', 'Subtitle', 'text']
  ],
  about: [
    ['section_title', 'Section heading', 'text'],
    ['paragraph1', 'First paragraph', 'textarea'],
    ['paragraph2', 'Second paragraph', 'textarea']
  ],
  contact: [
    ['section_title', 'Section heading', 'text'],
    ['description', 'Introduction', 'textarea'],
    ['email', 'Email address', 'email']
  ]
};
const SECTION_COPY = {
  hero: ['Home page', 'The first impression visitors see.'],
  about: ['About Jen', 'Tell visitors about your practice and what inspires you.'],
  contact: ['Contact', 'Let people know how to get in touch.'],
  gallery: ['Gallery', 'Add artwork, adjust its order, or update the images and captions.']
};

const connectPanel = document.querySelector('#connect');
const connectForm = document.querySelector('#connect-form');
const tokenInput = document.querySelector('#token');
const editorPanel = document.querySelector('#editor');
const fields = document.querySelector('#fields');
const sectionIntro = document.querySelector('#section-intro');
const saveButton = document.querySelector('#save');
const statusBox = document.querySelector('#status');

let token = '';
let head = '';
let treeSha = '';
let treePaths = new Set();
let section = 'hero';
let selectedArtwork = null;
let sections = {};
let originalSections = {};
let artworks = [];
let originalArtworks = new Map();
let originalIndex = [];
let uploads = new Map();
let statusTimer;

function notify(message, kind = '') {
  clearTimeout(statusTimer);
  statusBox.textContent = message;
  statusBox.className = `status ${kind}`;
  statusBox.hidden = false;
  if (kind !== 'error') statusTimer = setTimeout(() => { statusBox.hidden = true; }, 7000);
}

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    },
    cache: 'no-store'
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) throw new Error('That token was not accepted. Check it and try again.');
    if (response.status === 403) throw new Error('GitHub denied access. Check that your token has Contents: Read and write for this repository.');
    if (response.status === 404) throw new Error('Could not access this repository. Check the token’s repository selection.');
    throw new Error(data.message || `GitHub returned ${response.status}.`);
  }
  return data;
}

function decodeBase64(value) {
  const bytes = Uint8Array.from(atob(value.replace(/\s/g, '')), character => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function readJson(path, entries) {
  const entry = entries.get(path);
  if (!entry) throw new Error(`Missing ${path} in the repository.`);
  const blob = await request(`/git/blobs/${entry.sha}`);
  return JSON.parse(decodeBase64(blob.content));
}

async function loadContent() {
  const ref = await request('/git/ref/heads/main');
  head = ref.object.sha;
  const commit = await request(`/git/commits/${head}`);
  treeSha = commit.tree.sha;
  const tree = await request(`/git/trees/${treeSha}?recursive=1`);
  if (tree.truncated) throw new Error('The repository file list is too large to load safely.');
  const entries = new Map(tree.tree.filter(item => item.type === 'blob').map(item => [item.path, item]));
  treePaths = new Set(entries.keys());

  const [hero, about, contact, index] = await Promise.all([
    readJson('content/hero.json', entries),
    readJson('content/about.json', entries),
    readJson('content/contact.json', entries),
    readJson('content/gallery-index.json', entries)
  ]);
  if (!Array.isArray(index.files)) throw new Error('The gallery index has an invalid format.');
  const gallery = await Promise.all(index.files.map(async filename => {
    if (!/^[a-z][a-z0-9-]*\.json$/.test(filename)) throw new Error(`Invalid gallery filename: ${filename}`);
    return readJson(`content/gallery/${filename}`, entries);
  }));
  sections = { hero, about, contact };
  originalSections = structuredClone(sections);
  originalIndex = [...index.files];
  artworks = gallery.map((item, position) => ({
    ...item,
    _id: crypto.randomUUID(),
    filename: index.files[position].slice(0, -5)
  }));
  originalArtworks = new Map(artworks.map(item => [item._id, cleanArtwork(item)]));
  for (const upload of uploads.values()) URL.revokeObjectURL(upload.preview);
  uploads = new Map();
  selectedArtwork = null;
  render();
}

function cleanArtwork(item) {
  return {
    title: item.title?.trim() || '',
    medium: item.medium?.trim() || '',
    image: item.image?.trim() || '',
    alt: item.alt?.trim() || '',
    order: Number(item.order) || 0,
    sample: Boolean(item.sample),
    filename: item.filename?.trim() || ''
  };
}

function imageUrl(path, preview) {
  if (preview) return preview;
  return /^images\/[a-zA-Z0-9._/-]+$/.test(path || '') && !path.includes('..') ? `../${path}` : '';
}

function makeField(key, labelText, kind, value, onChange, hint = '') {
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const label = document.createElement('label');
  const input = document.createElement(kind === 'textarea' ? 'textarea' : 'input');
  input.id = `field-${key}`;
  if (kind !== 'textarea') input.type = kind;
  input.value = value ?? '';
  label.htmlFor = input.id;
  label.textContent = labelText;
  input.addEventListener('input', () => { onChange(input.value); updateSaveButton(); });
  wrapper.append(label, input);
  if (hint) {
    const help = document.createElement('small');
    help.textContent = hint;
    wrapper.append(help);
  }
  return wrapper;
}

function render() {
  const [heading, description] = SECTION_COPY[section];
  sectionIntro.replaceChildren();
  const title = document.createElement('h2');
  title.textContent = heading;
  const subtitle = document.createElement('p');
  subtitle.textContent = description;
  sectionIntro.append(title, subtitle);
  document.querySelectorAll('.nav-item').forEach(button => {
    button.classList.toggle('active', button.dataset.section === section);
    button.setAttribute('aria-current', button.dataset.section === section ? 'page' : 'false');
  });
  fields.replaceChildren();
  if (section === 'gallery') renderGallery();
  else renderSection();
  updateSaveButton();
}

function renderSection() {
  for (const [key, label, kind] of SECTION_FIELDS[section]) {
    fields.append(makeField(key, label, kind, sections[section][key], value => {
      sections[section][key] = value;
    }));
  }
}

function sortedArtwork() {
  return [...artworks].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

function slugify(value) {
  return value.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function renderGallery() {
  if (selectedArtwork) {
    const item = artworks.find(art => art._id === selectedArtwork);
    if (item) return renderArtworkForm(item);
    selectedArtwork = null;
  }
  const toolbar = document.createElement('div');
  toolbar.className = 'gallery-toolbar';
  const count = document.createElement('p');
  count.textContent = `${artworks.length} artwork${artworks.length === 1 ? '' : 's'}`;
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'button';
  add.textContent = '+ Add artwork';
  add.addEventListener('click', () => {
    const item = { _id: crypto.randomUUID(), _autoSlug: true, filename: '', title: '', medium: '', image: '', alt: '', order: artworks.length + 1, sample: false };
    artworks.push(item);
    selectedArtwork = item._id;
    render();
  });
  toolbar.append(count, add);
  fields.append(toolbar);
  const list = document.createElement('div');
  list.className = 'artwork-list';
  if (!artworks.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No artwork yet. Add your first piece.';
    list.append(empty);
  }
  for (const item of sortedArtwork()) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'artwork-row';
    const image = document.createElement('img');
    image.src = imageUrl(item.image, uploads.get(item._id)?.preview);
    image.alt = '';
    const copy = document.createElement('span');
    copy.className = 'row-copy';
    const name = document.createElement('strong');
    name.textContent = item.title || 'Untitled artwork';
    const detail = document.createElement('small');
    detail.textContent = `Order ${item.order} · ${item.medium || 'No description yet'}`;
    copy.append(name, detail);
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    row.append(image, copy, arrow);
    row.addEventListener('click', () => { selectedArtwork = item._id; render(); });
    list.append(row);
  }
  fields.append(list);
}

function renderArtworkForm(item) {
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'back-button';
  back.textContent = '← All artwork';
  back.addEventListener('click', () => { selectedArtwork = null; render(); });
  fields.append(back);
  const form = document.createElement('div');
  form.className = 'artwork-form';
  const heading = document.createElement('h3');
  heading.textContent = item.title || 'New artwork';
  form.append(heading);
  form.append(makeField('filename', 'File name', 'text', item.filename, value => {
    item.filename = value;
    item._autoSlug = false;
  }, originalArtworks.has(item._id) ? 'File name is fixed after publication.' : 'Use lowercase letters, numbers and hyphens.'));
  const slugInput = form.querySelector('#field-filename');
  if (originalArtworks.has(item._id)) slugInput.disabled = true;
  form.append(makeField('title', 'Artwork title', 'text', item.title, value => {
    item.title = value;
    heading.textContent = value || 'New artwork';
    if (item._autoSlug) {
      item.filename = slugify(value);
      slugInput.value = item.filename;
    }
  }));
  form.append(makeField('medium', 'Medium or description', 'text', item.medium, value => { item.medium = value; }));

  const preview = document.createElement('div');
  preview.className = 'image-preview';
  const previewImage = document.createElement('img');
  previewImage.alt = 'Artwork preview';
  const previewFallback = document.createElement('span');
  previewFallback.textContent = 'Image preview';
  const refreshPreview = () => {
    const src = imageUrl(item.image, uploads.get(item._id)?.preview);
    preview.replaceChildren();
    if (src) { previewImage.src = src; preview.append(previewImage); }
    else preview.append(previewFallback);
  };
  refreshPreview();
  form.append(preview);
  form.append(makeField('image', 'Image path', 'text', item.image, value => {
    const old = uploads.get(item._id);
    if (old) URL.revokeObjectURL(old.preview);
    uploads.delete(item._id);
    item.image = value;
    refreshPreview();
  }, 'Use an existing path inside images/, or upload a new image below.'));
  const uploadField = document.createElement('div');
  uploadField.className = 'field';
  const uploadLabel = document.createElement('label');
  uploadLabel.htmlFor = 'field-upload';
  uploadLabel.textContent = 'Upload new image';
  const uploadInput = document.createElement('input');
  uploadInput.id = 'field-upload';
  uploadInput.type = 'file';
  uploadInput.accept = 'image/jpeg,image/png,image/webp';
  uploadInput.addEventListener('change', () => {
    const file = uploadInput.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      uploadInput.value = '';
      return notify('Choose a JPG, PNG or WebP image.', 'error');
    }
    if (file.size > 8 * 1024 * 1024) {
      uploadInput.value = '';
      return notify('Images must be smaller than 8 MB.', 'error');
    }
    const old = uploads.get(item._id);
    if (old) URL.revokeObjectURL(old.preview);
    const previewUrl = URL.createObjectURL(file);
    uploads.set(item._id, { file, preview: previewUrl });
    item.image = file.name;
    form.querySelector('#field-image').value = file.name;
    refreshPreview();
    updateSaveButton();
  });
  uploadField.append(uploadLabel, uploadInput);
  form.append(uploadField);
  form.append(makeField('alt', 'Image description for accessibility', 'textarea', item.alt, value => { item.alt = value; }));
  form.append(makeField('order', 'Display order', 'number', item.order, value => { item.order = value; }, 'Lower numbers appear first.'));
  const sampleLabel = document.createElement('label');
  sampleLabel.className = 'checkbox-row';
  const sampleInput = document.createElement('input');
  sampleInput.type = 'checkbox';
  sampleInput.checked = Boolean(item.sample);
  sampleInput.addEventListener('change', () => { item.sample = sampleInput.checked; updateSaveButton(); });
  const sampleText = document.createElement('span');
  sampleText.textContent = 'This is sample artwork';
  sampleLabel.append(sampleInput, sampleText);
  form.append(sampleLabel);
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'danger-button';
  remove.textContent = 'Remove artwork';
  remove.addEventListener('click', () => {
    if (!confirm(`Remove “${item.title || 'this artwork'}” from the gallery? The image file will remain in the repository.`)) return;
    const upload = uploads.get(item._id);
    if (upload) URL.revokeObjectURL(upload.preview);
    uploads.delete(item._id);
    artworks = artworks.filter(art => art._id !== item._id);
    selectedArtwork = null;
    render();
  });
  form.append(remove);
  fields.append(form);
}

function validate() {
  for (const [name, definitions] of Object.entries(SECTION_FIELDS)) {
    for (const [key, label] of definitions) {
      if (!String(sections[name][key] ?? '').trim()) throw new Error(`${label} in ${name} cannot be empty.`);
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sections.contact.email.trim())) throw new Error('Enter a valid contact email address.');
  const filenames = new Set();
  for (const item of artworks) {
    const art = cleanArtwork(item);
    if (!/^[a-z](?:[a-z0-9-]*[a-z0-9])?$/.test(art.filename)) throw new Error('Artwork file names must use lowercase letters, numbers and hyphens.');
    if (filenames.has(art.filename)) throw new Error(`The file name “${art.filename}” is used twice.`);
    filenames.add(art.filename);
    if (!art.title || !art.medium || !art.alt) throw new Error(`Complete the title, medium and image description for “${art.filename}”.`);
    if (String(item.order).trim() === '' || !Number.isFinite(Number(item.order))) throw new Error(`Enter a valid order for “${art.title}”.`);
    if (!uploads.has(item._id) && (!/^images\/[a-zA-Z0-9._/-]+$/.test(art.image) || art.image.includes('..'))) throw new Error(`Choose an image inside images/ for “${art.title}”.`);
  }
}

function collectChanges() {
  const changes = [];
  for (const name of Object.keys(SECTION_FIELDS)) {
    if (JSON.stringify(sections[name]) !== JSON.stringify(originalSections[name])) {
      changes.push({ path: `content/${name}.json`, content: JSON.stringify(sections[name], null, 2) + '\n' });
    }
  }
  const currentNames = new Set();
  for (const item of artworks) {
    const cleaned = cleanArtwork(item);
    const filename = `${cleaned.filename}.json`;
    currentNames.add(filename);
    if (JSON.stringify(cleaned) !== JSON.stringify(originalArtworks.get(item._id))) {
      changes.push({ path: `content/gallery/${filename}`, content: JSON.stringify(cleaned, null, 2) + '\n' });
    }
  }
  for (const filename of originalIndex) {
    if (!currentNames.has(filename)) changes.push({ path: `content/gallery/${filename}`, sha: null });
  }
  const index = sortedArtwork().map(item => `${item.filename.trim()}.json`);
  if (JSON.stringify(index) !== JSON.stringify(originalIndex)) {
    changes.push({ path: 'content/gallery-index.json', content: JSON.stringify({ files: index }, null, 2) + '\n' });
  }
  return changes;
}

function updateSaveButton() {
  if (!head) return;
  const changes = collectChanges();
  saveButton.disabled = changes.length === 0 && uploads.size === 0;
  saveButton.textContent = saveButton.disabled ? 'No changes to publish' : 'Publish changes ↗';
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });
}

async function publish() {
  try {
    validate();
    const pending = collectChanges();
    if (!pending.length && !uploads.size) return;
    saveButton.disabled = true;
    notify('Publishing your changes…');
    const currentRef = await request('/git/ref/heads/main');
    if (currentRef.object.sha !== head) throw new Error('The repository changed since you opened the editor. Reload the page, reconnect, and review your edits before publishing.');
    for (const item of artworks) {
      const upload = uploads.get(item._id);
      if (!upload) continue;
      const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[upload.file.type];
      const path = `images/${item.filename.trim()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
      if (treePaths.has(path)) throw new Error('An image file name collided with an existing file. Please retry.');
      const blob = await request('/git/blobs', {
        method: 'POST',
        body: JSON.stringify({ content: await fileToBase64(upload.file), encoding: 'base64' })
      });
      pending.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
      item.image = path;
      const artworkPath = `content/gallery/${item.filename.trim()}.json`;
      const index = pending.findIndex(change => change.path === artworkPath);
      const artworkChange = { path: artworkPath, content: JSON.stringify(cleanArtwork(item), null, 2) + '\n' };
      if (index >= 0) pending[index] = artworkChange;
      else pending.push(artworkChange);
    }
    const newTree = await request('/git/trees', {
      method: 'POST',
      body: JSON.stringify({ base_tree: treeSha, tree: pending.map(change => ({
        mode: '100644', type: 'blob', ...change
      })) })
    });
    const commit = await request('/git/commits', {
      method: 'POST',
      body: JSON.stringify({ message: 'Update portfolio content via studio editor', tree: newTree.sha, parents: [head] })
    });
    const latestRef = await request('/git/ref/heads/main');
    if (latestRef.object.sha !== head) throw new Error('The repository changed while publishing. Reload, reconnect, and review your edits before trying again.');
    await request('/git/refs/heads/main', {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha, force: false })
    });
    await loadContent();
    notify('Published to GitHub. The website should update after the Pages deployment finishes.', 'success');
  } catch (error) {
    notify(error.message || 'Could not publish changes.', 'error');
    updateSaveButton();
  }
}

connectForm.addEventListener('submit', async event => {
  event.preventDefault();
  token = tokenInput.value.trim();
  connectForm.querySelector('button').disabled = true;
  try {
    await loadContent();
    tokenInput.value = '';
    connectPanel.hidden = true;
    editorPanel.hidden = false;
    notify('Editor ready.');
  } catch (error) {
    token = '';
    notify(error.message || 'Could not open the editor.', 'error');
  } finally {
    connectForm.querySelector('button').disabled = false;
  }
});

document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => {
  section = button.dataset.section;
  selectedArtwork = null;
  render();
}));
document.querySelector('#disconnect').addEventListener('click', () => {
  token = '';
  head = '';
  for (const upload of uploads.values()) URL.revokeObjectURL(upload.preview);
  uploads.clear();
  editorPanel.hidden = true;
  connectPanel.hidden = false;
  tokenInput.focus();
  notify('Disconnected.');
});
saveButton.addEventListener('click', publish);
window.addEventListener('beforeunload', event => {
  if (!head || (collectChanges().length === 0 && uploads.size === 0)) return;
  event.preventDefault();
  event.returnValue = '';
});
