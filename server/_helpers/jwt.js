import expressJwt from 'express-jwt';
import accountService from '../account/service.js';

export default function jwt() {
    const secret = 'thisismysecret';
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/api/status',
            '/api/store/products',
            '/api/accounts/auth'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const account = await accountService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!account) {
        return done(null, true);
    }

    done();
};