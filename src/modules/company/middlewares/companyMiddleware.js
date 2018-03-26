const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsCompany = require('./checkIsCompanyMiddleware');

module.exports.func = (router) => {
    router.get('/', authMiddleware, checkIsCompany);
    router.post('/update', authMiddleware, checkIsCompany);
    router.get('/indicators', authMiddleware, checkIsCompany);
    router.get('/indicators', authMiddleware, checkIsCompany);
    router.get('/employees', authMiddleware, checkIsCompany);
    router.get('/tests', authMiddleware, checkIsCompany);
    router.get('/transactions', authMiddleware, checkIsCompany);
    return router;
};