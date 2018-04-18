const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('./checkIsEmployeeMiddleware');

module.exports.func = (router) => {
    
    router.post('/info/update ', authMiddleware, checkIsEmployee);
    router.post('/skills/update', authMiddleware, checkIsEmployee);
    router.get('/contracts/awaited', authMiddleware, checkIsEmployee);
    router.get('/contracts/current', authMiddleware, checkIsEmployee);
    
    return router;
    
};
