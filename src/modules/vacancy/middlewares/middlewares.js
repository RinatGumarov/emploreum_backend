const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('../../employee/middlewares/checkIsEmployeeMiddleware');
const checkIsCompany = require('../../company/middlewares/checkIsCompanyMiddleware');

module.exports.func = (router) => {
    
    
    router.post('/create', authMiddleware, checkIsCompany);
    router.post('/:id([0-9]+)/invite', authMiddleware, checkIsCompany);
    router.get('/enroll/:vacancyId([0-9]+)', authMiddleware, checkIsEmployee);
    router.get('/:vacancyId([0-9]+)/candidate/:candidatesId([0-9]+)/reject', authMiddleware, checkIsCompany);
    router.get('/:vacancyId([0-9]+)/available', authMiddleware, checkIsEmployee);
    
    return router;
};
