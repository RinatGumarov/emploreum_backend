const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('../../employee/middlewares/checkIsEmployeeMiddleware');
const checkIsCompany = require('./checkIsCompanyMiddleware');

module.exports.func = (router) => {
    
    router.all('*', authMiddleware);
    
    router.get('/', checkIsCompany);
    router.post('/update', checkIsCompany);
    router.get('/indicators', checkIsCompany);
    router.get('/employees', checkIsCompany);
    router.get('/tests', checkIsCompany);
    router.get('/transactions', checkIsCompany);
    router.get('/vacancy', checkIsCompany);
    router.get('/vacancy/:vacancyId([0-9]+)/candidate/:candidatesId([0-9]+)/reject', checkIsCompany);
    
    router.post('/vacancy/create', checkIsCompany);
    router.get('/vacancy/:vacancyId([0-9]+)/available', checkIsEmployee);
    
    return router;
};
