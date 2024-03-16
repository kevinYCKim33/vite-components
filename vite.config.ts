import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import dts from 'vite-plugin-dts'; // added for adding typing
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(), // allows JS files to consume the css directly
    dts({
      include: ['src/components'], // for adding typing to just our components
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/components'),
      name: 'FrontendMastersTotallyAwesomeDesignSystem',
      fileName: 'femds',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'], // see expl. why below
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});

// npm run build
// 19kb is a lot
// that's because it's including react
// component library built on react shouldn't come with react;
// let's do better
// dist/style.css   0.59 kB │ gzip:  0.31 kB
// dist/femds.js   77.17 kB │ gzip: 19.25 kB
// dist/style.css       0.59 kB │ gzip:  0.31 kB
// dist/femds.umd.cjs  47.61 kB │ gzip: 14.54 kB

// after adding rollupOptions:
// super small library now
// dist/style.css  0.59 kB │ gzip: 0.31 kB
// dist/femds.js   0.03 kB │ gzip: 0.05 kB
// dist/style.css      0.59 kB │ gzip: 0.31 kB
// dist/femds.umd.cjs  0.19 kB │ gzip: 0.16 kB
