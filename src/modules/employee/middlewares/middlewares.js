const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('./checkIsEmployeeMiddleware');

module.exports.func = (router) => {
    router.get('/vacancy/enroll/:vacancyId([0-9]+)', authMiddleware, checkIsEmployee);
    router.get('/vacancy/recommended', authMiddleware, checkIsEmployee);
    router.get('/indicators', authMiddleware, checkIsEmployee);
    router.get('/address', authMiddleware, checkIsEmployee);
    router.get('/contracts/awaited', authMiddleware, checkIsEmployee);
    router.get('/contracts/current', authMiddleware, checkIsEmployee);
    router.get('/skills', authMiddleware, checkIsEmployee);
    router.post('/skills/add', authMiddleware, checkIsEmployee);
    router.get('/info', authMiddleware, checkIsEmployee);
    router.post('/info/update ', authMiddleware, checkIsEmployee);
    return router;
};
