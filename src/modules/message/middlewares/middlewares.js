const authMiddleware = require('../../auth/middlewares/authMiddleware');

module.exports.func = (router) => {
    router.all('*', authMiddleware);
    return router;
};
