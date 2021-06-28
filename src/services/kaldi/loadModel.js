import { openDB } from '../../../_snowpack/pkg/idb.js';

function downloadModel(url) {
    return fetch(url)
        .then((response) => {
            if (response.ok) return response.blob();
            throw new Error(`"${url}": ${response.statusText}`);
        })
        .then((blob) => blobToArrayBuffer(blob))
}

function blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
            resolve(reader.result);
        });
        reader.addEventListener('error', reject);
        reader.readAsArrayBuffer(blob);
    });
}

let db;
async function getDb() {
    if (!db) db = await openDB('asr-models', 1, {
        upgrade(db) {
            db.createObjectStore('models');
        }
    });

    return db;
}

async function loadModelFromIdb(name) {
    return (await getDb()).get('models', name);
}

async function saveModelIntoIdb(name, buf) {
    return (await getDb()).put('models', buf, name);
}


export default async function loadModel(name) {
    // console.time('db');
    const model = await loadModelFromIdb(name);
    // console.timeEnd('db');
    if (model !== undefined) return model;

    // console.time('dl');
    return downloadModel(name)
        .then(buf => {
            // console.timeEnd('dl');
            // console.time('save');
            saveModelIntoIdb(name, buf); //.then(() => console.timeEnd('save'));
            return buf;
        });
}