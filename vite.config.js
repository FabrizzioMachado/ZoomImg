import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: './public',
    },
    resolve: {
        alias: {
            '@': '/src',
            'vue': '/node_modules/vue/dist/vue.esm-browser.js',
        },
    },
});
