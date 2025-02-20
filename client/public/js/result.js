export function binocularZoomEffect(containerId, imageSelector, fullscreenBtnId = null) {
    const container = document.getElementById(containerId);
    const images = document.querySelectorAll(imageSelector);
    const fullscreenBtn = fullscreenBtnId ? document.getElementById(fullscreenBtnId) : null;

    //console.log('we are applying the binocular zoom effect! on', images);
    
    if (!container || !images) {
        console.error('Container or image element not found');
        return;
    }
    
    images.forEach(image => {
        image.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
            const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
    
            const scale = 2; // Zoom scale
            const originX = (x / rect.width) * 100; //x transform 
            const originY = (y / rect.height) * 100; //y transform
    
            image.style.transformOrigin = `${originX}% ${originY}%`;
            image.style.transform = `scale(${scale})`;
        });
    
        image.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)';
        });
    })

    if(fullscreenBtn) {
        console.log('we have a fullscreen button', fullscreenBtn);
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        });

    
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenBtn.classList.remove('fullscreen-exit');
                fullscreenBtn.classList.add('fullscreen');
            }
            else {
                fullscreenBtn.classList.remove('fullscreen');
                fullscreenBtn.classList.add('fullscreen-exit');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    binocularZoomEffect('imageContainer', '.image', 'fullScreenButton');
});