const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('./checkIsEmployeeMiddleware');

module.exports.func = (router) => {
    router.all('*', authMiddleware);
    router.get('/vacancy/enroll/:vacancyId([0-9]+)', checkIsEmployee);
    router.get('/vacancy/recommended', checkIsEmployee);
    router.get('/indicators', checkIsEmployee);
    router.get('/address', checkIsEmployee);
    router.get('/contracts/awaited', checkIsEmployee);
    router.get('/contracts/current', checkIsEmployee);
    router.get('/skills', checkIsEmployee);
    router.post('/skills/add', checkIsEmployee);
    router.get('/info', checkIsEmployee);
    router.post('/info/update ', checkIsEmployee);
    return router;
};
