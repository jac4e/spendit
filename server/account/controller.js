import express from 'express';
import Guard from 'express-jwt-permissions';
import transaction from '../_helpers/transaction.js';
import accountService from './service.js';

const router = express.Router();
const guard = Guard()

// Routes
router.post('/auth', auth);

router.get('/self', getSelf);
router.get('/self/balance', getSelfBalance);
router.get('/self/transactions', getSelfTransactions);

router.post('/register', guard.check('admin'), register);
router.get('/:accountId/transaction', guard.check('admin'), getTransactions);
// router.put('/:accountId', guard.check('admin'), updateAccountById);
router.get('/getAll', guard.check('admin'), getAll);
// router.get('/search', search)

function auth(req, res, next) {
    console.log('authing');
    accountService.auth(req.body)
        .then(account => account ? res.json(account) : res.status(401).json({
            message: 'ccid or password is incorrect'
        })).catch(err => next(err));
}

function getSelfBalance(req, res, next) {
    // console.log("test'")
    // console.log(req.user.sub);
    accountService.getBalance(req.user.sub).then(resp => res.json(resp)).catch(err => next(err));
}

function getSelfTransactions(req, res, next) {
    // console.log(`self transactions: ${JSON.stringify(req.user)}`)
    transaction.getByAccountId(req.user.sub).then(resp => res.json(resp)).catch(err => next(err));

}

function register(req, res, next) {
    accountService.create(req.body)
    .then(() => res.json({}))
    .catch(err => next(err))
}

function getAll(req, res, next) {
    accountService.getAll()
    .then(resp => res.json(resp))
    .catch(err => next(err))
}

function getSelf(req, res, next){

}

function getSelfBalance(req, res, next){

}

function updateSelf(req, res, next){

}

function getBalance(req, res, next) {
    accountService.getBalance(req.body).then(resp => res.json(resp)).catch(err => next(err));
}

function getTransactions(req, res, next) {
    transaction.getById(req.body).then(resp => res.json(resp)).catch(err => next(err));
}

function getBalance(req, res, next){

}

// function search(req, res, next) {
//     console.log(req.query);
//     accountService.search(req.query)
//     .then(resp => resp.count > 0 ? res.json(resp) : res.status(204))
//     .catch(err => next(err))
// }

export default router;