const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('../../employee/middlewares/checkIsEmployeeMiddleware');
const checkIsCompany = require('./checkIsCompanyMiddleware');

module.exports.func = (router) => {
    
    
    router.post('/vacancy/create', authMiddleware, checkIsCompany);
    router.post('/vacancy/:id([0-9]+)/invite', authMiddleware, checkIsCompany);
    router.get('/vacancy/:vacancyId([0-9]+)/candidate/:candidatesId([0-9]+)/reject', authMiddleware, checkIsCompany);
    router.get('/vacancy/:vacancyId([0-9]+)/available', authMiddleware, checkIsEmployee);
    
    return router;
};
