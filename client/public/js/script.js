/*import { createApp } from 'vue';
import App from "./app.vue";

createApp(App).mount("#app");*/

import { binocularZoomEffect } from "./result.js";
import { loadImages, destroyImages, gallerySectionFunction } from "./gallerySelection.js";

// Navbar constants and variables
const navbar = document.getElementById('navbar');
const navItemsIcon = document.querySelector('.bi-list');

// Home constants and variables
const homeIcon = document.querySelector('.bi-house-fill');

// Gallery constants and variables
const gallerySection = document.getElementById('gallerySection');
const galleryIcon = document.querySelector('.gallery');

// Help constants and variables
const helpSection = document.getElementById('helpSection');
const helpIcon = document.querySelector('.bi-question-circle');

// Promo constants and variables
const promoSection = document.getElementById('promoSection');
const promoIcon = document.querySelector('.bi-code-slash');

// File input constants and variables
const pseudoFileInput = document.getElementById('pseudoFileInput');
const submitButton = document.getElementById('submitButton');

// Sections constants and variables
const sectionsMap = new Map([
    [gallerySection, galleryIcon],
    [helpSection, helpIcon],
    [promoSection, promoIcon]
]);

// Sanitize the file name before getting into analysis
function sanitizeFileName(fileName) {
    return fileName.replace(/[\\/:"*?<>|]/g, '_')
                  .replace(/\.\.+/g, '.'); // Replace consecutive dots with a single dot
}

function getTypeOfFile(file) {
    const findDot = file.lastIndexOf('.');
    return file.slice(findDot); 
}

// File input function
function openFileInput(pseudoFileInput, submitButton) {
    const input = document.getElementById('fileInput');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    // Check if elements exist
    if (!input || !pseudoFileInput || !submitButton) {
        console.error('Required elements not found.');
        return;
    }

    submitButton.disabled = true;

    // Add a click event listener to the pseudoFileInput
    pseudoFileInput.addEventListener('click', () => {
        input.click(); // Trigger the file input dialog
    });

    // If the input has a file, then change the pseudoFileInput text
    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            let fileName = input.files[0].name;
            let fileExtension = getTypeOfFile(fileName);

            if(imageExtensions.includes(fileExtension)){
                fileName = sanitizeFileName(fileName);
                
                // Handle the name. Get the first 5 chars or those before the last dot
                const dotIndex = fileName.lastIndexOf('.');
                const inputExtension = fileName.slice(dotIndex);
                const truncatedFileName = dotIndex > 5 ? fileName.slice(0, 5) : fileName.slice(0, dotIndex);

                // Add the extension
                pseudoFileInput.textContent = truncatedFileName + inputExtension;

                // It's valid, therefore enable the submit button
                submitButton.disabled = false;

            } else {
                pseudoFileInput.textContent = 'Invalid File';
                return 
            } 
        } 

        else {
            pseudoFileInput.textContent = 'Choose File';
        }
    });
}

// Toggle the navbar's activeItems class
function navbarFunctionality() {
    navbar.classList.toggle('activeItems');

    console.log('Toggling activeItems');
}

// Toggle the activeSection class and handle section activation
function otherItemsFunctionality(section) {
    console.log('Navbar with an active child:', navbar.querySelector('.active'));

    // Toggle the activeSection class based on the navbar's state
    if (navbar.classList.contains('activeItems') && !navbar.querySelector('.active')) {
        navbar.classList.add('activeSection');
    } 
    // Toggle the active class on the clicked section
    section.classList.toggle('active');
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    pseudoFileInput.addEventListener('click', () => openFileInput(pseudoFileInput, submitButton));

    // Toggle navbar functionality
    [navItemsIcon, homeIcon].forEach(icon => 
        icon.addEventListener('click', () => {
            navbarFunctionality();
            navbar.classList.remove('activeSection');
        }
    ));

    // Handle section toggling
    sectionsMap.forEach((icon, section) => {
        if (icon && section) { // Ensure the elements exist
            icon.addEventListener('click', () => {
                console.log('The targeted icon is:', icon);

                if (!navbar.classList.contains('activeItems')) {
                    navbarFunctionality();
                } 

                // Remove the active class from all sections except the clicked one
                sectionsMap.forEach((otherIcon, otherSection) => {
                    if(otherSection === section) {
                        navbar.classList.remove('activeSection');
                        return;
                    }
                    otherSection.classList.remove('active');
                });

                // Handle navbar state
                otherItemsFunctionality(section);
            });
        } else {
            console.error('One of the sections or icons is null or undefined.');
        }
    });

    // Managing the gallery
    [galleryIcon, navItemsIcon].forEach(icon => {
        if (!icon) {
            console.error(`${icon} not found`);
            return;
        }

        icon.addEventListener('click', () => {
            // Destroy the existing images before continuing.
            destroyImages();
            
            // Then load the new images
            loadImages();
            
            // Take some time to load
            setTimeout(() => {
                binocularZoomEffect('galleryContainer', '.zoom');
                gallerySectionFunction();
            }, 500);
        });
    });
});