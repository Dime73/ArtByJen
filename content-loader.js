// Load and populate site content from JSON files
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load hero section
        const heroResponse = await fetch('content/hero.json');
        const heroData = await heroResponse.json();
        document.querySelector('.hero-content h2').textContent = heroData.title;
        document.querySelector('.hero-content p').textContent = heroData.subtitle;

        // Load about section
        const aboutResponse = await fetch('content/about.json');
        const aboutData = await aboutResponse.json();
        document.querySelector('.about-section .section-title').textContent = aboutData.section_title;
        const aboutText = document.querySelector('.about-text');
        aboutText.innerHTML = `
            <p>${aboutData.paragraph1}</p>
            <p>${aboutData.paragraph2}</p>
        `;

        // Load contact section
        const contactResponse = await fetch('content/contact.json');
        const contactData = await contactResponse.json();
        document.querySelector('.contact-section .section-title').textContent = contactData.section_title;
        const contactContent = document.querySelector('.contact-content');
        contactContent.innerHTML = `
            <p>${contactData.description}</p>
            <p>Email: <a href="mailto:${contactData.email}">${contactData.email}</a></p>
        `;

        // Load gallery items
        const galleryGrid = document.querySelector('.gallery-grid');
        galleryGrid.innerHTML = ''; // Clear existing items
        
        // Fetch all gallery JSON files
        const galleryFiles = [
            'abstract-dreams.json',
            'mountain-serenity.json',
            'silent-reflection.json',
            'morning-light.json',
            'urban-rhythms.json',
            'botanical-wonder.json',
            'form-and-space.json',
            'frozen-moment.json',
            'textured-harmony.json'
        ];

        const galleryItems = [];
        for (const file of galleryFiles) {
            try {
                const response = await fetch(`content/gallery/${file}`);
                if (response.ok) {
                    const item = await response.json();
                    galleryItems.push(item);
                }
            } catch (error) {
                console.warn(`Could not load gallery item: ${file}`, error);
            }
        }

        // Sort by order field
        galleryItems.sort((a, b) => (a.order || 0) - (b.order || 0));

        // Create gallery item elements
        galleryItems.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${item.image}" alt="${item.alt}">
                <div class="gallery-item-info">
                    <h3>${item.title}</h3>
                    <p>${item.medium}</p>
                </div>
            `;
            galleryGrid.appendChild(galleryItem);
        });

    } catch (error) {
        console.error('Error loading content:', error);
    }
});
