import express from 'express';
import expressJwt from 'express-jwt';
import Guard from 'express-jwt-permissions';
import transaction from '../_helpers/transaction.js';
import accountService from './service.js';

const router = express.Router();
const guard = Guard()

// Routes
router.post('/auth', auth);

router.get('/self', getSelf);
router.post('/self/resetSession', resetSessionSelf);
router.get('/self/balance', getSelfBalance);
router.get('/self/transactions', getSelfTransactions);
// router.put('/self', updateSelf);

router.post('/register', guard.check('admin'), register);
router.get('/:accountId/resetSession', guard.check('admin'), resetSession);
router.get('/:accountId/balance', guard.check('admin'), getBalance);
router.get('/:accountId/transaction', guard.check('admin'), getTransactions);
// router.put('/:accountId', guard.check('admin'), updateAccountById);
router.get('/', guard.check('admin'), getAll);
// router.get('/search', search)

// Public routes
function auth(req, res, next) {
    accountService.auth(req.body)
        .then(account => account ? res.json(account) : res.status(401).json({
            message: 'ccid or password is incorrect'
        })).catch(err => next(err));
}

// User available routes
function getSelf(req, res, next) {
    accountService.getById(req.user.sub).then(account => account ? res.json(account) : res.status(500).json({
        message: 'Something went wrong grabbing self'
    })).catch(err => next(err));
}

function resetSessionSelf(req, res, next) {
    accountService.resetSession(req.user.sub).then(() => res.json({})).catch(err => next(err));
}

function getSelfBalance(req, res, next) {
    // console.log("test'")
    // console.log(req.user.sub);
    accountService.getBalance(req.user.sub).then(resp => res.json(resp)).catch(err => next(err));
}

function getSelfTransactions(req, res, next) {
    // console.log(`self transactions: ${JSON.stringify(req.user)}`)
    accountService.getSelfTransactions(req.user.sub).then(resp => res.json(resp)).catch(err => next(err));
}

// Private routes

function register(req, res, next) {
    accountService.create(req.body).then(() => res.json({})).catch(err => next(err))
}

function getAll(req, res, next) {
    // console.log("getall")
    accountService.getAll()
        .then(resp => res.json(resp))
        .catch(err => next(err))
}

function resetSession(req, res, next) {
    accountService.resetSession(req.body).then(() => res.json({})).catch(err => next(err));
}

function getAccountById(req, res, next) {

}

function updateAccountById(req, res, next) {

}

function getBalance(req, res, next) {
    accountService.getBalance(req.body).then(resp => res.json(resp)).catch(err => next(err));
}

function getTransactions(req, res, next) {
    transaction.getById(req.body).then(resp => res.json(resp)).catch(err => next(err));
}


// function search(req, res, next) {
//     console.log(req.query);
//     accountService.search(req.query)
//     .then(resp => resp.count > 0 ? res.json(resp) : res.status(204))
//     .catch(err => next(err))
// }

export default router;