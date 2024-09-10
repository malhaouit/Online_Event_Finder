const passport = require('passport');

const authenticate = (strategy) => {
    console.log('Authenticating with strategy:', strategy);
    return passport.authenticate(strategy, { session: false });
};

module.exports = authenticate;