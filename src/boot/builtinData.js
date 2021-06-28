import tags, { save as saveTags } from '../models/builtin/DefaultTags.ts.proxy.js';
import Model from '../db/Model.ts.proxy.js';

Model.__db.ready().then(() => saveTags());