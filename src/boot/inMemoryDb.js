import Memory from '../db/MemoryDatomSource.ts.proxy.js';
import { DB } from '../db/DB.ts.proxy.js';
import Model from '../db/Model.ts.proxy.js';

Model.__db = new DB(new Memory());
window.db = Model.__db;

export default Model.__db;
