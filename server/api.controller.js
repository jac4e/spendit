import express from 'express';
import mongoose from 'mongoose';
import db from './_helpers/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import accounts from './account/controller.js';
import admin from './admin/controller.js';
import store from './store/controller.js';
// import jwt from './_helpers/jwt.js';

// import guard from 'express-jwt-permissions';
import bodyParser from 'body-parser';
import cors from 'cors'

const router = express.Router();
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());
router.use(cors());
// router.use(jwt());
// no more jwt, using session cookie
router.use(session({
  store: MongoStore.create({ 
    client: mongoose.connection.getClient(),
    crypto: {
      secret: 'squirrel'
    }
  })
}));
router.get('/status', (req, res) => {
  res.status(200).send('200');
});
router.use('/accounts', accounts)
router.use('/admin', admin)
router.use('/store', store)

export default router;