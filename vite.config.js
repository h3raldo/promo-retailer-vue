import { fileURLToPath, URL } from 'node:url'
import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const copyJSToSymfony = () => ({
  name: 'output-plugin-stats',
  closeBundle: async () => {
    const oldFiles = await fg(['../tools/public/assets/**.*']);
    oldFiles.forEach( f => fs.unlinkSync(f) );

    const entries = await fg(['dist/assets/**.*']);
    let version = '';

    entries.forEach( entry => {
      let file = fs.readFileSync( entry, 'utf-8' );
      let fileName = path.basename(entry);

      if( fileName.includes('index-') ) version = fileName;

      fs.writeFileSync( `../tools/public/assets/${fileName}` , file );
    })
    fs.writeFileSync( '../tools/templates/base-vue-script.twig' , version );
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), copyJSToSymfony()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
