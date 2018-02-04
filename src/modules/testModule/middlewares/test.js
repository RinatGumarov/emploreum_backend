const passport = require('passport');
const authMiddleware = require('../../auth/middlewares/authMiddleware');


module.exports.func = (router) => {

    router.get('*', authMiddleware);

    return router;
};

