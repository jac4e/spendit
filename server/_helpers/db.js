
import mongoose from 'mongoose';
import config from '../config.js';
mongoose.connect(`mongodb://${config.db.url}:${config.db.port}/${config.db.name}`);
mongoose.Promise = global.Promise;

import user from '../_models/account.model.js';
import product from '../_models/product.model.js';
import transaction from '../_models/transaction.model.js';

export default { user, product, transaction };