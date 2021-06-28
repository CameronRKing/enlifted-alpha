import './src/boot/browserDb.js';
// import '@/boot/inMemoryDb.js';
import './src/boot/init.js';
import m from './_snowpack/pkg/mithril.js';
import ComponentExplorer from './ComponentExplorer.m.js';

m.route(document.body, '/', {
    '/:path...': ComponentExplorer
});

window.m = m;