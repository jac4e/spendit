
import mongoose from 'mongoose';
mongoose.connect('mongodb://127.0.0.1:27017/');
mongoose.Promise = global.Promise;

import user from '../_models/account.model.js';
import product from '../_models/product.model.js';
import transaction from '../_models/transaction.model.js';

export default { user, product, transaction };