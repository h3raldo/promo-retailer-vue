import { fileURLToPath, URL } from 'node:url'
import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

let fn = {
  paths: {
    pr: '../../promo-retailer/tools',
    pc: '../../promo-connections/tools'
  },
  async removeFiles(){
    const oldFiles = await fg([
      `${fn.paths.pr}/public/assets/**.*`,
      `${fn.paths.pc}/public/assets/**.*`
    ]);
    oldFiles.forEach( f => fs.unlinkSync(f) );
  },
  copyFileToSymfony( file, fileName ){
    fs.writeFileSync( `${fn.paths.pr}/public/assets/${fileName}` , file );
    fs.writeFileSync( `${fn.paths.pc}/public/assets/${fileName}` , file );
  },
  updateVueScript( version ){
    fs.writeFileSync( `${fn.paths.pr}/templates/base-vue-script.twig` , version );
    fs.writeFileSync( `${fn.paths.pc}/templates/base-vue-script.twig` , version );
  }
}

const copyJSToSymfony = () => ({
  name: 'output-plugin-stats',
  closeBundle: async () => {
    await fn.removeFiles();

    const entries = await fg(['dist/assets/**.*']);
    let version = '';

    entries.forEach( entry => {
      let file = fs.readFileSync( entry, 'utf-8' );
      let fileName = path.basename(entry);

      if( fileName.includes('index-') ) version = fileName;

      fn.copyFileToSymfony( file, fileName );
    })
    fn.updateVueScript( version );
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
