<template>
    <div id="gallerySection" class="section">
        <h1 v-if="galleryImages.length > 0">Gallery</h1>
        <h1 v-else>Upload an image to see the gallery.</h1>
    
        <div id="galleryContainer">
            <div 
                v-for="(src, index) in galleryImages"
                :key="index"
                class="galleryItem"
                @click="openImage(index)"
            >
                <img :src="src" alt="Gallery Image" />
                <div 
                    v-if="activeImageIndex === index" 
                    class="zoomOut" 
                    @click.stop="closeImage"
                >
                    <i class="bi bi-twitter-x"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "gallerySection",
        props: {
            fetchUrl: { type: String, required: true }, // Fetch URL for images
            limit: { type: Number, default: 10 }, // Limit of images
            reverseOrder: { type: Boolean, default: false },
        },
        data() {
            return {
                galleryImages: [],
                activeImageIndex: null, // Track which image is active
            };
        },
        methods: {
            async fetchGalleryImages( reverse = false ) {
                try {
                    const response = await fetch(this.fetchUrl);
                    const images = Object.values(await response.json());
    
                    if( reverse ) images.reverse();
                    this.galleryImages = images.slice(0, this.limit); // Store images reactively
                } catch (error) {
                    console.error("Error loading images:", error);
                }
            },
    
            openImage(index) {
                this.activeImageIndex = index; // Activate the clicked image
            },
        
            closeImage() {
                this.activeImageIndex = null; // Close the zoomed image
            },
        },
        mounted() {
            this.fetchGalleryImages( this.reverseOrder ); // Auto-fetch on mount
        },
    };
</script>
    
<style lang="sass">
    #gallerySection
        width: 100%
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        padding: 1em 0
        overflow-y: scroll
        height: 100%
        z-index: 999
    
        h1
            font-size: 2em
            margin-bottom: 1em
    
        #galleryContainer 
            display: grid
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
            gap: 1em
            padding: 0 1em
            overflow-y: scroll
            height: 100%
    
        .galleryItem
            width: clamp(10em, 15vw, 15em)
            aspect-ratio: 1.75/1
            position: relative
            cursor: pointer
            overflow: hidden
            clip-path: inset(0 0 0 0)
            background: rgba(37, 37, 37, 0.75)
    
            img
                width: 100% 
                height: 100%
                object-fit: cover
                transition: all 0.25s ease
    
            .zoomOut
                position: absolute
                top: 5px
                right: 5px
                background: rgba(0, 0, 0, 0.6)
                color: white
                padding: 5px
                border-radius: 50%
                cursor: pointer
    
            i
                font-size: 1.5em
    
    @media screen and (min-width: 768px)
        #galleryContainer
            grid-template-columns: repeat(3, minmax(250px, 1fr))   
</style>