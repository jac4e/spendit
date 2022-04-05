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

async function purchaseCart(token, cartidlist) {
    // cart is array of ids
    //
    //    [ ids ... ]
    //

    // check product count
    // console.log("buying cart")
    if (cartidlist.length < 1) {
        throw "cart length cannot be less than 1"
    }

    const products = await Product.find({'_id': { $in: cartidlist } });

    // create cart object for invoice
    let cart = (await Product.find({'_id': { $in: cartidlist } }).lean()).map(({image, id, stock, ...keepAttrs}) => ({...keepAttrs, amount: 0, total: 0}));
    
    let sum = 0;
    for (let index = 0; index < cartidlist.length; index++) {
        const productIndex = products.findIndex((product) => product._id.toString() === cartidlist[index])
        if(!products[productIndex]){
            throw `Product with id: ${cartidlist[index]} could not be found`
        }
        // calc product amt in cart
        cart[productIndex].amount++;
        // calc sum
        sum += products[productIndex].price;
    }

    // finalize cart
    for (let index = 0; index < cart.length; index++) {
        if (cart[index].amount>products[index].stock){
            throw `product ${cart[index].name} does not have enough stock left`
        }
        cart[index].total = cart[index].amount * cart[index].price;
    }
    // console.log(cart)

    // deserialize cart

    let transactionParams = {
        accountid: token.sub,
        type: 'credit',
        reason: 'Web Purchase',
        products: cart,
        total: sum
    }
    // console.log(transactionParams)
    if (await accountService.pay(transactionParams.total, transactionParams.accountid) !== true){
        // payment error
        throw "Payment error"
    }

    // payment has complete, can now reduce stock levels
    // for (let index = 0; index < cart.length; index++) {
    //     products[index].stock -= cart[index].amount;
    //     // console.log(products[index])
    //     products[index].save();
    // }

    await transactionService.create(transactionParams);
}

export default { getAllProducts, purchaseCart, createProduct, getProductById}