import db from '../_helpers/db.js';
import jwt from 'jsonwebtoken';
import transactionService from '../_helpers/transaction.js';
import accountService from '../account/service.js';

const Product = db.product;
const secret = 'thisismysecret';

async function getAllProducts() {
    return await Product.find({});
}

async function purchaseCart(token, cart) {
    // cart is array of objects
    //[ ...,
    //    { id: amount: }
    //]

    // check product count
    if (cart.length <= 0) {
        return;
    }

    // currently productIds can't contain duplicates i.e. cart can not have duplicates
    const products = await Product.find({'_id': { $in: productIds } }).lean();
    
    // check if cart length == products length

    if (cart.length !== products.length){
        throw `Not all products found`
    }
    
    sum = 0;
    for (let index = 0; index < cart.length; index++) {
        sum += cart[index].amount * products[index].price;
    }

    const decoded = jwt.verify(token, secret);
    const purchaser = await Account.findById(decoded.sub);
    transactionParams = {
        accountid: purchaser.id,
        type: 'credit',
        reason: 'Web Purchase',
        amount: sum
    }
    accopuntService.pay(accountid, sum);
    transactionService.create(transactionParams);
}

export default { getAllProducts, purchaseCart}