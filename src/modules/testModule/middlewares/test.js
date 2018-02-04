const passport = require('passport');
const authMiddleware = require('../../login/middlewares/authMiddleware');


module.exports.func = (router) => {

    router.get('*', authMiddleware);

    return router;
};

