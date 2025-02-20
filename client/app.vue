<template>
    <div id="app">
        <navbar :navItems="navItems"
                :logoAndColor="logoAndColor">
        </navbar>
    </div>
</template>

<script>
    import gallerySection from './gallerySection.vue';
    export default {
        name: "app",
        components: {
            gallerySection
        },
        data(){
            return {
                logoAndColor: ['My Navbar', 'orange'],
                navItems: [
                    ['Home', 'house-fill'],
                    ['Twitter', 'twitter'],
                    ['Help', 'question-circle'],
                    ['Promo', 'gift-fill'],
                    ['Contact', 'envelope-fill'],
                ]
            }
        }
    }
</script>

<style scoped lang="sass">
    body
        font-family: 'Arial', sans-serif
        margin: 0
        padding: 0
        background-color: #f0f0f0
</style>