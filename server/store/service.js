import db from '../_helpers/db.js';
import jwt from 'jsonwebtoken';
import config from '../deploy/config.js';
import transactionService from '../_helpers/transaction.js';
import accountService from '../account/service.js';
const Product = db.product;

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

async function updateProductById(id,productParam) {
    console.log(id, productParam)
    let product = await Product.findById(id)
    console.log(product)
    if (!product) {
        throw `Product '${id}' does not exist`;
    }
    console.log(Object.getOwnPropertyNames(product))
    // update product
    for (const key in productParam) {
        console.log(key)
        console.log(product._doc.hasOwnProperty(key))
        if (product._doc.hasOwnProperty(key)) {
            console.log(product[key], productParam[key])
            product[key] = productParam[key]
        }
    }
    product.save()
}
async function deleteProductById(id) {
    await Product.deleteOne({_id: id})
}

async function purchaseCart(token, cartSerialized) {
    // cart is array of ids
    //
    //    [ ids ... ]
    //

    // check product count
    // console.log("buying cart")
    if (cartSerialized.length < 1) {
        throw "Cart is empty"
    }
    const products = await Product.find({'_id': { $in: cartSerialized.map((item) => item.id) } });
    console.log(products)
    // create cart object for invoice
    let cart = (await Product.find({'_id': { $in: cartSerialized.map((item) => item.id) } }).lean()).map(({image, id, stock, price, ...keepAttrs}) => ({...keepAttrs, price: BigInt(price), amount: 0, total: 0n}));
    
    let sum = 0n;
    for (let index = 0; index < cartSerialized.length; index++) {
        const productIndex = products.findIndex((product) => product._id.toString() === cartSerialized[index].id)
        if(!products[productIndex]){
            throw `Product with id: ${cartSerialized[index].id} could not be found`
        }
        // calc product amt in cart

        cart[productIndex].amount = cartSerialized[index].amount;
        if (cart[productIndex].amount>products[productIndex].stock){
            throw `product ${cart[productIndex].name} does not have enough stock left`
        }

        cart[productIndex].total = BigInt(cart[productIndex].amount) * cart[productIndex].price;
        // calc sum
        sum += cart[productIndex].total;
    }

    console.log(cart)

    let transactionParams = {
        accountid: token.sub,
        type: 'debit',
        reason: 'Web Purchase',
        products: cart.map(({total, price, ...rest}) => ({total: total.toString(), price: price.toString(), ...rest})),
        total: sum.toString()
    }
    console.log(transactionParams)
    // console.log(transactionParams)
    if (await accountService.pay(transactionParams.total, transactionParams.accountid) !== true){
        // payment error
        throw "Payment error"
    }

    // payment has complete, can now reduce stock levels
    for (let index = 0; index < cart.length; index++) {
        products[index].stock -= cart[index].amount;
        // console.log(products[index])
        products[index].save();
    }

    await transactionService.create(transactionParams);
}

export default { getAllProducts, deleteProductById, purchaseCart, createProduct, getProductById, updateProductById}