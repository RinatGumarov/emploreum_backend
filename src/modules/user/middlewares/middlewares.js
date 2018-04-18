const authMiddleware = require('../../auth/middlewares/authMiddleware');

module.exports.func = (router) => {
    router.get('/languages', authMiddleware);
    return router;
};
