import Memory from '../db/MemoryDatomSource.js';
import { DB } from '../db/DB.js';
import Model from '../db/Model.js';

Model.__db = new DB(new Memory());
window.db = Model.__db;

export default Model.__db;
