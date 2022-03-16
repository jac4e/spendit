import express from 'express';
import Guard from 'express-jwt-permissions';
import accountService from './service.js';

const router = express.Router();
const guard = Guard()

// Routes
router.post('/auth', auth);

router.get('/self', getSelf);
router.get('/self/balance', getSelfBalance);
router.put('/self', updateSelf);

router.post('/register', guard.check('admin'), register);
// router.get('/:accountId', guard.check('admin'), getAccountById);
// router.get('/:accountId/balance', guard.check('admin'), getBalance);
// router.put('/:accountId', guard.check('admin'), updateAccountById);
router.get('/getAll', guard.check('admin'), getAll);
// router.get('/search', search)

function auth(req, res, next) {
    console.log('authing');
    accountService.auth(req.body)
    .then(account => account ? res.json(account) : res.status(400).json({ message: 'ccid or password is incorrect'}))
    .catch(err => next(err))
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

function getAccountById(req, res, next){

}

function updateAccountById(req, res, next){

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