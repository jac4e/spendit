import express from 'express';
import Guard from 'express-jwt-permissions';
import accountService from './service.js';

const router = express.Router();
const guard = Guard()

// Routes
router.post('/auth', auth)
router.post('/register', guard.check('admin'), register)
router.get('/getAll', guard.check('admin'), getAll)
// router.get('/search', search)

function auth(req, res, next) {
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

function getTransactions(req, res, next){

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