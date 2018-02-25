const authMiddleware = require('../../auth/middlewares/authMiddleware');

module.exports.func = (router) => {

    router.post('/approve', authMiddleware);

    return router;
};
