import db from '../_helpers/db.js';
import transaction from '../_helpers/transaction.js';

const Account = db.account
const Product = db.product

async function createTransaction(transactionParam) {
    transactionParam.reason = 'Admin Override';
    transaction.create(transactionParam);
}

export default { createTransaction }