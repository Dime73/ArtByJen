// Load and populate site content from JSON files
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Helper function to escape HTML to prevent XSS
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Load hero section
        const heroResponse = await fetch('content/hero.json');
        if (!heroResponse.ok) {
            throw new Error(`Failed to load hero content: ${heroResponse.status}`);
        }
        const heroData = await heroResponse.json();
        document.querySelector('.hero-content h2').textContent = heroData.title;
        document.querySelector('.hero-content p').textContent = heroData.subtitle;

        // Load about section
        const aboutResponse = await fetch('content/about.json');
        if (!aboutResponse.ok) {
            throw new Error(`Failed to load about content: ${aboutResponse.status}`);
        }
        const aboutData = await aboutResponse.json();
        document.querySelector('.about-section .section-title').textContent = aboutData.section_title;
        const aboutText = document.querySelector('.about-text');
        // Clear existing content and create new paragraphs safely
        aboutText.innerHTML = '';
        const p1 = document.createElement('p');
        p1.textContent = aboutData.paragraph1;
        const p2 = document.createElement('p');
        p2.textContent = aboutData.paragraph2;
        aboutText.appendChild(p1);
        aboutText.appendChild(p2);

        // Load contact section
        const contactResponse = await fetch('content/contact.json');
        if (!contactResponse.ok) {
            throw new Error(`Failed to load contact content: ${contactResponse.status}`);
        }
        const contactData = await contactResponse.json();
        document.querySelector('.contact-section .section-title').textContent = contactData.section_title;
        const contactContent = document.querySelector('.contact-content');
        // Create elements safely
        contactContent.innerHTML = '';
        const descP = document.createElement('p');
        descP.textContent = contactData.description;
        const emailP = document.createElement('p');
        emailP.textContent = 'Email: ';
        const emailLink = document.createElement('a');
        emailLink.href = 'mailto:' + contactData.email;
        emailLink.textContent = contactData.email;
        emailP.appendChild(emailLink);
        contactContent.appendChild(descP);
        contactContent.appendChild(emailP);

        // Load gallery items - discover files dynamically
        const galleryGrid = document.querySelector('.gallery-grid');
        galleryGrid.innerHTML = ''; // Clear existing items
        
        // Try to load gallery index file, fall back to hardcoded list
        let galleryFiles = [];
        try {
            const indexResponse = await fetch('content/gallery/index.json');
            if (indexResponse.ok) {
                const indexData = await indexResponse.json();
                galleryFiles = indexData.files || [];
            }
        } catch (error) {
            // Fall back to hardcoded list if index doesn't exist
            galleryFiles = [
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
        }

        const galleryItems = [];
        for (const file of galleryFiles) {
            try {
                const response = await fetch(`content/gallery/${file}`);
                if (response.ok) {
                    const item = await response.json();
                    galleryItems.push(item);
                } else {
                    console.warn(`Could not load gallery item: ${file} (status: ${response.status})`);
                }
            } catch (error) {
                console.warn(`Error loading gallery item: ${file}`, error);
            }
        }

        // Sort by order field
        galleryItems.sort((a, b) => (a.order || 0) - (b.order || 0));

        // Create gallery item elements safely
        galleryItems.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            // Create image element
            const img = document.createElement('img');
            img.src = escapeHtml(item.image);
            img.alt = escapeHtml(item.alt);
            
            // Create info container
            const infoDiv = document.createElement('div');
            infoDiv.className = 'gallery-item-info';
            
            const title = document.createElement('h3');
            title.textContent = item.title;
            
            const medium = document.createElement('p');
            medium.textContent = item.medium;
            
            infoDiv.appendChild(title);
            infoDiv.appendChild(medium);
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(infoDiv);
            galleryGrid.appendChild(galleryItem);
        });

    } catch (error) {
        console.error('Error loading content:', error);
        // Keep fallback static content in HTML
    }
});
