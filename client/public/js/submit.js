export function sanitizeFileName(fileName) {
    return fileName.replace(/[\\/:"*?<>|]/g, '_')
                  .replace(/\.\.+/g, '.'); // Replace consecutive dots with a single dot
}

export function getTypeOfFile(file) {
    const findDot = file.lastIndexOf('.');
    return file.slice(findDot).toLowerCase(); 
}

export function openFileInput(pseudoFileInput, submitButton, allowedType = 'images') {

    // Define different file type categories
    const FILE_TYPES = {
        images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        documents: ['.pdf', '.doc', '.docx', '.txt'],
        audio: ['.mp3', '.wav', '.ogg', 'flac'],
        videos: ['.mp4', '.mov', '.avi']
    };

    if (!pseudoFileInput || !submitButton) return;

    const input = document.getElementById('fileInput');

    if (!input) {
        console.error('File input element not found.');
        return;
    }

    const allowedExtensions = FILE_TYPES[allowedType] || FILE_TYPES.images; // Default to images

    // Disable submit button initially
    submitButton.disabled = true;

    pseudoFileInput.addEventListener('click', () => {
        input.click(); // Open file selection dialog
    });

    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            let fileName = input.files[0].name;
            const fileExtension = getTypeOfFile(fileName);

            if (allowedExtensions.includes(fileExtension)) {
                fileName = sanitizeFileName(fileName);
                
                const dotIndex = fileName.lastIndexOf('.');
                const truncatedFileName = dotIndex > 5 ? fileName.slice(0, 5) : fileName.slice(0, dotIndex);

                pseudoFileInput.textContent = truncatedFileName + fileExtension;
                submitButton.disabled = false; // ✅ Enable button for valid file
            } else {
                pseudoFileInput.textContent = 'Invalid File';
                submitButton.disabled = true; // ❌ Disable for invalid file
            }
        } else {
            pseudoFileInput.textContent = 'Choose File';
            submitButton.disabled = true; // ❌ Disable if no file
        }
    });
}