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

router.post('/register', register);
router.post('/create', guard.check('admin'), create);
router.get('/:accountId/resetSession', guard.check('admin'), resetSession);
router.get('/:accountId/balance', guard.check('admin'), getBalance);
router.get('/:accountId/transaction', guard.check('admin'), getTransactions);
router.put('/:accountId/verify', guard.check('admin'), verify);
// router.delete('/:accountId', guard.check('admin'), deleteAccountById);
// router.put('/:accountId', guard.check('admin'), updateAccountById);
router.get('/', guard.check('admin'), getAll);
// router.get('/search', search)

// Public routes
function auth(req, res, next) {
    accountService.auth(req.body)
        .then(account => account ? res.json(account) : res.status(401).json({
            message: 'username or password is incorrect'
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

function register(req, res, next) {
    // Public registration, assume account is unverified and assign user role
    req.body.role = 'user';

    // if (req.body.accessToken !==  ){
    //     // registration form initiated creation
    //     // get email, name, and google account id from google
    //     accountParam = form
    //     accountParam.firstName = googleFirstName
    //     accountParam.lastName = googleLastName
    //     accountParam.email = googleEmail
    //     accountParam.gid = googleId
    //   } else {
    //     // admin initiated creation, all needed values are their
    //     accountParam = form
    //   }

    accountService.create(accountParam, false).then(() => res.json({})).catch(err => next(err))
}

// Private routes

function create(req, res, next) {
    // Registration by admin, assume account is verified
    accountService.create(req.body, true).then(() => res.json({})).catch(err => next(err))
}

function getAll(req, res, next) {
    // console.log("getall")
    accountService.getAll()
        .then(resp => res.json(resp))
        .catch(err => next(err))
}

function verify(req, res, next) {
    accountService.verify(req.params['accountId']).then(resp => res.json(resp)).catch(err => next(err));
}

function resetSession(req, res, next) {
    accountService.resetSession(req.params['accountId']).then(() => res.json({})).catch(err => next(err));
}

function getAccountById(req, res, next) {

}

function updateAccountById(req, res, next) {

}

function getBalance(req, res, next) {
    accountService.getBalance(req.params['accountId']).then(resp => res.json(resp)).catch(err => next(err));
}

function getTransactions(req, res, next) {
    transaction.getById(req.params['accountId']).then(resp => res.json(resp)).catch(err => next(err));
}


// function search(req, res, next) {
//     console.log(req.query);
//     accountService.search(req.query)
//     .then(resp => resp.count > 0 ? res.json(resp) : res.status(204))
//     .catch(err => next(err))
// }

export default router;