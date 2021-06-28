import Idb from '../db/IdbDatomSource.ts.proxy.js';
import { DB } from '../db/DB.ts.proxy.js';
import Model from '../db/Model.ts.proxy.js';

Model.__db = new DB(new Idb());
window.db = Model.__db;

export default Model.__db;
