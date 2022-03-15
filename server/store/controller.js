import express from 'express';
import guard from 'express-jwt-permissions';
import storeService from './service.js';

const router = express.Router();

// Routes
router.get('/products', getProducts)
router.post('/purchase', purchase)

function getProducts(req, res, next){
    storeService.getAllProducts()
    .then(resp => res.json(resp))
    .catch(err => next(err))
}

function purchase(req, res, next){

}

export default router;