const jwtSecret = 'your_jwt_secret'; // This should be in an environment variable in a real application

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

/**
 * Generates a JWT token for a user.
 * @function
 * @param {Object} user - The user object
 * @returns {string} - JWT token
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/**
 * @module auth
 * @param {Object} router - The router object
 */
module.exports = (router) => {
    /**
     * POST: Login a user and generate a JWT token
     * @function
     * @name post/login
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @returns {Object} - JSON object with user data and token
     */
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}