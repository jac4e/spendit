import db from '../_helpers/db.js';
import transaction from '../_helpers/transaction.js';

const Account = db.account
const Product = db.product

async function createAccount(accountParam) {
    // validate
    if (await Account.findOne({
        ccid: accountParam.ccid
    })) {
        throw `CCID '${accountParam.ccid}' is already taken`
    }
    const account = new Account(accountParam);
    // hash password
    if (accountParam.password) {
        account.hash = bcrypt.hashSync(accountParam.password, 10);
    } else {
        throw `No password`;
    }
    // save account
    await account.save();
}

async function createProduct(productParam) {
    // validate
    if (await Product.findOne({
        name: productParam.name
    })) {
        throw `Product '${productParam.name}' already exists`;
    }
    const product = new Product(productParam);

    await product.save();
}

async function createTransaction(transactionParam) {
    transactionParam.reason = 'Admin Override';
    transaction.create(transactionParam);
}

export default { createAccount, createProduct, createTransaction }