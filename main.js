// import '@/boot/browserDb.js';
// import '@/boot/inMemoryDb.js';
import './src/boot/firestoreDb.js';
import './src/boot/init.js';
import { save as saveTags } from './src/models/builtin/DefaultTags.js';
import m from './_snowpack/pkg/mithril.js';
import ComponentExplorer from './ComponentExplorer.m.js';

window.saveTags = saveTags;

m.route(document.body, '/', {
    '/:path...': ComponentExplorer
});

window.m = m;