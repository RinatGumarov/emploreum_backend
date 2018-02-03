const passport = require('passport');


module.exports.func = (router) => {

    router.get('*', (req, res, next) => {
        next();
    });

    return router;
};

