import db from '../_helpers/db.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import transactionService from '../_helpers/transaction.js';
import accountService from '../account/service.js';

const Product = db.product;
const secret = config.secret;

async function getAllProducts() {
    return await Product.find({}).lean();
}

async function getProductById(productId) {
    return await Product.findById(productId).lean();
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

async function purchaseCart(token, cart) {
    // cart is array of ids
    //
    //    [ ids ... ]
    //

    // check product count
    // console.log("buying cart")
    if (cart.length < 1) {
        throw "cart length cannot be less than 1"
    }

    // currently productIds can't contain duplicates i.e. cart can not have duplicates
    const products = await Product.find({'_id': { $in: cart } });
    // console.log(products)
    // check if cart length == products length

    // if (cart.length !== products.length){
    //     throw `Not all products found`
    // }

    let amount = new Array(products.length).fill(0);;
    
    let sum = 0;
    for (let index = 0; index < cart.length; index++) {
        const productIndex = products.findIndex((product) => product._id.toString() === cart[index])
        if(!products[productIndex]){
            throw `Product with id: ${cart[index]} could not be found`
        }
        // calc product amt in cart
        amount[productIndex]++;
        // calc sum
        sum += products[productIndex].price;
    }

    // check if enough stock
    for (let index = 0; index < products.length; index++) {
        // console.log(amount[index],products[index].stock)
        if (amount[index]>products[index].stock){
            throw `product ${products[index].name} does not have enough stock left`
        }
    }

    let transactionParams = {
        accountid: token.sub,
        type: 'credit',
        reason: 'Web Purchase',
        products: cart,
        amount: sum
    }
    // console.log(transactionParams)
    if (await accountService.pay(transactionParams.amount, transactionParams.accountid) !== true){
        // payment error
        throw "Payment error"
    }

    // payment has complete, can now reduce stock levels
    for (let index = 0; index < products.length; index++) {
        products[index].stock -= amount[index];
        // console.log(products[index])
        products[index].save();
    }

    await transactionService.create(transactionParams);
}

export default { getAllProducts, purchaseCart, createProduct, getProductById}