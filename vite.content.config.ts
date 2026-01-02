import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development';

    return {
        build: {
            minify: isDev ? false : 'esbuild',
            sourcemap: isDev ? 'inline' : false, // Inline sourcemap is often better for content scripts
            lib: {
                entry: resolve(__dirname, 'src/content/index.ts'),
                name: 'ContentScript',
                fileName: 'content',
                formats: ['iife'], // Compile to IIFE to bundle dependencies
            },
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/content.js',
                    extend: true,
                },
            },
            outDir: 'dist',
            emptyOutDir: false, // Don't clear dist, as main build runs first
        },
    };
});
