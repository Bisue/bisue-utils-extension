import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development';

    return {
        plugins: [react()],
        build: {
            minify: isDev ? false : 'esbuild',
            sourcemap: isDev,
            rollupOptions: {
                input: {
                    popup: resolve(__dirname, 'src/popup/index.html'),
                    background: resolve(__dirname, 'src/background/index.ts'),
                    // content script handling moved to vite.content.config.ts
                },
                output: {
                    entryFileNames: 'assets/[name].js',
                    chunkFileNames: 'assets/[name].js',
                    assetFileNames: 'assets/[name].[ext]',
                },
            },
            outDir: 'dist',
            emptyOutDir: true,
        },
    };
});
