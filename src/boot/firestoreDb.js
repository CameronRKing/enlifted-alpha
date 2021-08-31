import { db } from './firebase.js';
import Model from '../db/Model.js';

Model.__db = db;

export default Model.__db;