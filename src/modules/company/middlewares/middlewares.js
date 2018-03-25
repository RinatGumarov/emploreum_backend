const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('../../employee/middlewares/checkIsEmployeeMiddleware');
const checkIsCompany = require('./checkIsCompanyMiddleware');

module.exports.func = (router) => {
    
    router.get('/', authMiddleware, checkIsCompany);
    router.post('/update', authMiddleware, checkIsCompany);
    router.get('/indicators', authMiddleware, checkIsCompany);
    router.get('/employees', authMiddleware, checkIsCompany);
    router.get('/tests', authMiddleware, checkIsCompany);
    router.get('/transactions', authMiddleware, checkIsCompany);
    router.get('/vacancy/:vacancyId([0-9]+)/candidate/:candidatesId([0-9]+)/reject', authMiddleware, checkIsCompany);
    
    router.post('/vacancy/create', authMiddleware, checkIsCompany);
    router.get('/vacancy/:vacancyId([0-9]+)/available', authMiddleware, checkIsEmployee);
    
    return router;
};
