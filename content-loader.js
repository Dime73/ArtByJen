document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('#year').textContent = new Date().getFullYear();

  async function readJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error('Could not load ' + path);
    return response.json();
  }

  try {
    const [hero, about, contact, index] = await Promise.all([
      readJson('content/hero.json'),
      readJson('content/about.json'),
      readJson('content/contact.json'),
      readJson('content/gallery-index.json')
    ]);

    if (hero.title) {
      const title = document.querySelector('#hero-title');
      const parts = hero.title.trim().match(/^(.*?)(Jen\.?$)/i);
      if (parts) {
        title.replaceChildren(document.createTextNode(parts[1]));
        const emphasis = document.createElement('em');
        emphasis.textContent = parts[2];
        title.append(emphasis);
      } else {
        title.textContent = hero.title;
      }
    }
    document.querySelector('#hero-subtitle').textContent = hero.subtitle || '';

    document.querySelector('#about-title').replaceChildren(document.createTextNode(about.section_title || 'About Jen'));
    document.querySelector('#about-title').insertAdjacentHTML('beforeend', '<span class="heading-dot">.</span>');
    const aboutText = document.querySelector('.about-text');
    aboutText.replaceChildren();
    for (const copy of [about.paragraph1, about.paragraph2]) {
      if (!copy) continue;
      const p = document.createElement('p');
      p.textContent = copy;
      aboutText.append(p);
    }

    const contactTitle = document.querySelector('#contact-title');
    contactTitle.replaceChildren(document.createTextNode(contact.section_title || 'Contact'));
    contactTitle.insertAdjacentHTML('beforeend', '<span class="heading-dot">.</span>');
    const contactContent = document.querySelector('.contact-content');
    contactContent.querySelector('p').textContent = contact.description || '';
    const emailLink = contactContent.querySelector('a');
    emailLink.href = 'mailto:' + contact.email;
    emailLink.replaceChildren(document.createTextNode(contact.email + ' '));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    emailLink.append(arrow);

    const results = await Promise.allSettled((index.files || []).map(file => readJson('content/gallery/' + file)));
    const items = results.filter(result => result.status === 'fulfilled').map(result => result.value).sort((a, b) => (a.order || 0) - (b.order || 0));
    if (items.length) {
      const grid = document.querySelector('.gallery-grid');
      grid.replaceChildren();
      items.forEach((item, position) => {
        const figure = document.createElement('figure');
        figure.className = 'gallery-item';
        const frame = document.createElement('div');
        frame.className = 'art-frame';
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.alt || item.title || 'Artwork';
        image.loading = position === 0 ? 'eager' : 'lazy';
        image.decoding = 'async';
        frame.append(image);
        const caption = document.createElement('figcaption');
        caption.className = 'gallery-item-info';
        const title = document.createElement('h3');
        title.textContent = item.title || '';
        const medium = document.createElement('p');
        medium.textContent = item.medium || '';
        caption.append(title, medium);
        figure.append(frame, caption);
        grid.append(figure);
      });
      document.querySelector('.gallery-note').hidden = !items.some(item => item.sample);
    }
  } catch (error) {
    console.error('The portfolio content could not be updated.', error);
  }
});
