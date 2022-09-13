import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import config from '../deploy/config.js';
import db from '../_helpers/db.js';

const Account = db.account;

export default function jwtAuthGuard() {
    const secret = config.secret;
    return expressJwt({ secret: secret,algorithms: ['HS256'], isRevoked: isRevokedCallback }).unless({
        path: [
            // public routes that don't require authentication
            '/api/status',
            '/api/store/products',
            '/api/accounts/auth',
            '/api/accounts/register',
        ]
    });
}

async function isRevokedCallback(req, payload, done) {
    const account = await Account.findById(payload.sub);
    // revoke token if user no longer exists
    if (!account) {
        return done(null, true);
    }
    // revoke if account session id != payload session id
    if ((account.sessionid || '') !== payload.sid) {
        return done(null, true);
    }
    done();
};