/* Core required for Ionic components to work properly */
import '../../_snowpack/pkg/@ionic/core/css/ionic.bundle.css.proxy.js';

// ionic imports a bunch of files dynamically
// for them to load properly, two things must happen:
    // (1) add <script data-stencil-namespace="ionic" data-resources-url="_snowpack/pkg/@ionic/core/dist/ionic/"></script> to index.html
        // tried adding it dynamically to the page here; wasn't working
    // (2) for snowpack to cache the files, they must be imported directly
// importDir() wasn't working correctly
// snowpack kept complaining that it couldn't find perfectly valid identifiers
// generating this list of imports dynamically doesn't work,
// but copy-pasting the code does
//
// I hate javascript and the JS ecosystem.

import '../../_snowpack/pkg/@ionic/core/dist/ionic/index.esm.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/ionic.esm.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/ionic.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-00309ad2.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-00fa322b.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-02397960.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-02a325ba.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-0312f882.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-04b622ed.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-074889b8.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-089e4b67.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-0906e425.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-0b5de7fa.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-0bddfc73.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-0c976852.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-0d9cab2d.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-0f066bc0.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-10ac5925.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-11181cdf.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-125156f2.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-128ac2b7.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-1353b86c.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-1497eb21.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-16e46306.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-1b5884b4.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-1c52a3ad.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-1ccd06e6.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-1df64a63.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-1e489c33.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-1f45d3f1.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-1f87b1b9.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-21c15686.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-23052401.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-25287e45.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-278c89c9.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-279a2419.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-27efeebf.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-2b4de713.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-2bb21262.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-2d5aae94.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-317ad851.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-346c9e1e.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-35fee353.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-377f4388.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-379187ad.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-37caebf1.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-38a18592.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-3bf5082a.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-3cf20360.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-3dd896fb.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-3df3e749.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-413a63f4.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-41881304.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-42fd7ecf.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-43078e70.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-45f8604b.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-4893e692.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-4a14b061.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-4f6da350.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-4f8c28aa.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-50b64133.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-5116e5ff.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-515e367a.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-53170bf1.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-54facb8e.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-55a37074.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-56624cb6.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-5a43ae24.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-5a66d5f2.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-5d689c29.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-613c0939.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-6220b96e.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-62239b92.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-62f7a30d.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-67d8b01f.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-69066cdd.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-6db41d57.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-71216066.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-71ab06a2.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-750c2c7c.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-77cf1aa4.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-7a427fe7.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-7b14fdc6.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-7f6317e9.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-80248f72.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-8316592e.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-83f7fc4c.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-848e532e.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-84e59236.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-86a04a52.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-87bc8498.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-88237282.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-8a0d5290.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-8ab75603.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-8b767840.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-91c9f4c9.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-93ea0aa1.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-94c70170.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-9c79be89.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-9f65f1d1.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-a013b234.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-a5fe3e63.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-a65c1311.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-a7864060.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-a7f24d43.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-a96dd2bf.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-a9f897be.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-af7d7be2.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-b06466bf.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-b31f65dc.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-b56f2db4.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-b5b01e2c.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-b8516058.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-b9b6f1c7.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-bac8255f.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-bc5ea23f.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-c026c817.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-c099509d.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-c0f0cd01.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-c4ec548d.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-c7d1d470.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-cb0a180a.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-cc9425bd.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-ce1ea776.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-d02bc8d0.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-d1d9195c.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-d3682733.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-d624cf76.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-db72110e.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-ddc62ed1.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-ded6307a.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-df23eb1d.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-e046fe49.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-e447e17a.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-e5dc79d5.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-e5f17738.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-e62f8ce9.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-e99486e5.entry.js';
// this file has invalid syntax! what does it even do?
// import '@ionic/core/dist/ionic/p-e9a952cc.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-eb1489c6.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-ecf344e5.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-efdb3d60.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-f290f794.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-f428a208.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-f4d3feee.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-f4d641a6.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-f7d7c193.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-f7f09238.system.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-f888830d.system.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-fc0f777f.entry.js';
import '../../_snowpack/pkg/@ionic/core/dist/ionic/p-ff3c9f7a.system.js';


// what I want is to import every file in @ionic/core/dist/ionic
// import '@ionic/core/dist/ionic/p-0f066bc0.system.js'
// import '@ionic/core/dist/ionic/p-4a14b061.system.js'
// import '@ionic/core/dist/ionic/p-21c15686.system.js'
// import '@ionic/core/dist/ionic/p-43078e70.system.js'
// import '@ionic/core/dist/ionic/p-a7f24d43.system.entry.js'
// import '@ionic/core/dist/ionic/p-a7f24d43.system.entry.js'