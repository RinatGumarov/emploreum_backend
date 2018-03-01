const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('../../employee/middlewares/checkIsEmployeeMiddleware');
const checkIsCompany = require('./checkIsCompanyMiddleware');

module.exports.func = (router) => {
    
    router.all('*', authMiddleware);
    router.get('/', checkIsCompany);
    router.post('/update', checkIsCompany);
    router.get('/vacancy/:vacancyId([0-9]+)/available', checkIsEmployee);
    return router;
};
