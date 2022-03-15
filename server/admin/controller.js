import express from 'express';
import Guard from 'express-jwt-permissions';
import service from './service.js';

const router = express.Router();
const guard = Guard()

router.use(guard.check('admin'))

export default router;