import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import svgLoader from 'vite-svg-loader';
// import { visualizer } from 'rollup-plugin-visualizer';
import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        svgLoader({
            svgo: false
        }),
        // visualizer(),
        splitVendorChunkPlugin(),
    ],
    resolve: {
        alias: [
            { find: '@', replacement: resolve(__dirname, 'src') },
            { find: '@core', replacement: resolve(__dirname, 'src/core') },
            { find: '@asset', replacement: resolve(__dirname, 'src/assets') },
            { find: '@page', replacement: resolve(__dirname, 'src/pages') },
            { find: '@component', replacement: resolve(__dirname, 'src/components') },
            { find: '@service', replacement: resolve(__dirname, 'src/services') },
            { find: '@interface', replacement: resolve(__dirname, 'src/interfaces') },
            { find: '@store', replacement: resolve(__dirname, 'src/store') },
            { find: '@report', replacement: resolve(__dirname, 'src/reports') },
            { find: '@util', replacement: resolve(__dirname, 'src/utilities') },
        ],
    },
    build: {
        // rollupOptions: {
        //     output: {
        //         manualChunks(id: string) {
        //             // console.log('ManualChunk ID: ' + id);
        //             if (id.includes('primevue')) {
        //                 return 'primevue';
        //             }
        //         },
        //     }
        // },
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://test.edison-online.dk/',
                changeOrigin: true
            }
        },
        hmr: {
            overlay: true
        },
    },
    envDir: 'src/environment',
})
