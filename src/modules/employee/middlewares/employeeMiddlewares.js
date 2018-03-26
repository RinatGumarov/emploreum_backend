const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('./checkIsEmployeeMiddleware');

module.exports.func = (router) => {
    
    router.get('/vacancy/enroll/:vacancyId([0-9]+)', authMiddleware, checkIsEmployee);
    router.get('/vacancy/recommended', authMiddleware, checkIsEmployee);
    router.get('/indicators', authMiddleware, checkIsEmployee);
    return router;

};
