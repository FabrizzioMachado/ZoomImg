// Common variables 
const container = document.getElementById('galleryContainer');
const galleryTitle = document.getElementById('galleryTitle');

// Generate a unique user token if not gotten from the localStorage
let userToken = localStorage.getItem("userToken");
if (!userToken) {
    userToken = Math.random().toString(36).substr(2, 10);
    localStorage.setItem("userToken", userToken);
}

// Fetch and display images
export async function loadImages(limit = 9) {
    try {
        const response = await fetch(`/api/uploads?limit=${limit}`);
        const images = await response.json();
        console.log(images, 'images');
        
        //dynamic response if no images
        if (images.length === 0) {
            galleryTitle.innerHTML = 'Upload an image to see the gallery.';
            console.error('No gallery items found.');
            return;
        }

        //otherwise, set the title.
        galleryTitle.innerHTML = 'Gallery';

        //create the images
        images.forEach(src => {
            // Create div with classList 
            const div = document.createElement('div');
            div.classList.add('galleryItem');

            // to each div, add an image with the src, class and alt
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Gallery Image';
            img.classList.add('zoom');
            img.classList.add('image');

            //append the image to its div and the div to the container
            div.appendChild(img);
            container.appendChild(div);
        });

    } catch (error) {
        console.error('Error loading images:', error);
    }
}

export function destroyImages() {
    const images = container.querySelectorAll('.zoom');
    images.forEach((image) => {
        image.removeEventListener('mousemove', () => {});
        image.removeEventListener('mouseleave', () => {});
    });
    container.innerHTML = ''; // Clear the container
}

export function gallerySectionFunction() { 
    const galleryItems = document.querySelectorAll('.galleryItem');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // If the clicked item is already active, do nothing
            if (item.classList.contains('active')) {
                console.log('Already active, ignoring further clicks.');
                return;
            }

            // Remove 'active' class from all items
            galleryItems.forEach(i => {
                i.classList.remove('active');
                // replacing the existingzoomOut to avoid overcreation
                const existingZoomOut = i.querySelector('.zoomOut');
                if (existingZoomOut) {
                    i.removeChild(existingZoomOut);
                }
                console.log('Removed active class from other items.');
            });

            // Add 'active' class to the clicked item
            item.classList.add('active');

            // Create a unique X element for this item
            const zoomOutElement = document.createElement('div');
            zoomOutElement.classList.add('zoomOut');
            zoomOutElement.innerHTML = '<i class="bi bi-twitter-x"></i>';

            // Add event listener to remove 'active' class and zoomOutElement
            zoomOutElement.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the parent item's click event
                item.classList.remove('active');
                item.removeChild(zoomOutElement);
                console.log('Removed active class and zoomOutElement.');
            });

            // Append the unique zoomOutElement to the clicked item
            item.appendChild(zoomOutElement);
        });
    });
}