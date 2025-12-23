// Load and populate site content from JSON files
document.addEventListener('DOMContentLoaded', async function() {
    try {
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
        aboutText.replaceChildren();
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
        contactContent.replaceChildren();
        const descP = document.createElement('p');
        descP.textContent = contactData.description;
        const emailP = document.createElement('p');
        emailP.textContent = 'Email: ';
        const emailLink = document.createElement('a');
        emailLink.href = 'mailto:' + encodeURIComponent(contactData.email);
        emailLink.textContent = contactData.email;
        emailP.appendChild(emailLink);

        // Helper to load gallery items for a given list of JSON filenames
        async function loadGalleryItemsForFiles(fileNames) {
            const items = [];
            for (const file of fileNames) {
                try {
                    const response = await fetch(`content/gallery/${file}`);
                    if (response.ok) {
                        const item = await response.json();
                        items.push(item);
                    }
                    // Silently skip files that don't exist (404 is expected for discovery patterns)
                } catch (error) {
                    // Only log actual errors (network failures, JSON parse errors, etc.)
                    // Fetch doesn't throw for 404, so any error here is unexpected
                    console.warn(`Error loading gallery item: ${file}`, error);
                }
            }
            return items;
        }

        let galleryItems = [];

        // Prefer a manifest-based discovery of gallery JSON files
        try {
            const manifestResponse = await fetch('content/gallery/manifest.json');
            if (manifestResponse.ok) {
                const manifestData = await manifestResponse.json();

                // Support either { "files": [...] } or a plain array [...]
                const rawFiles = Array.isArray(manifestData)
                    ? manifestData
                    : Array.isArray(manifestData.files)
                        ? manifestData.files
                        : [];

                const manifestFiles = Array.from(
                    new Set(
                        rawFiles.filter(
                            (f) => typeof f === 'string' && f.toLowerCase().endsWith('.json')
                        )
                    )
                );

                if (manifestFiles.length > 0) {
                    galleryItems = await loadGalleryItemsForFiles(manifestFiles);
                }
            }
        } catch (e) {
            // Any failures here will cause a fallback to the hardcoded list below
            console.warn('Falling back to hardcoded gallery file list:', e);
        }

        // Fallback to existing hardcoded discovery if manifest is unavailable or empty
        if (galleryItems.length === 0) {
            // Build list of gallery files to check
            // Includes existing files and some common patterns for new files added through the CMS
            const galleryFiles = [
                // Existing gallery items
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

            // Add some numbered patterns for CMS-generated files (silently fail if not found)
            for (let i = 1; i <= 10; i++) {
                galleryFiles.push(`gallery-item-${i}.json`);
            }

            galleryItems = await loadGalleryItemsForFiles(galleryFiles);
        }
        // Sort by order field
        galleryItems.sort((a, b) => (a.order || 0) - (b.order || 0));

        // Create gallery item elements safely
        galleryItems.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            // Create image element (direct assignment is safe for element properties)
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.alt;
            
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
