import Idb from '../db/IdbDatomSource.js';
import { DB } from '../db/DB.js';
import Model from '../db/Model.js';

Model.__db = new DB(new Idb());
window.db = Model.__db;

export default Model.__db;
