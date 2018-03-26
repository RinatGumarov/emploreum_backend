const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsCompany = require('../../company/middlewares/checkIsCompanyMiddleware');
const checkIsEmployee = require('../../employee/middlewares/checkIsEmployeeMiddleware');

module.exports.func = (router) => {
    
    router.post('/company/create', checkIsCompany);
    router.get('/:testId([0-9]+)', checkIsCompany);
    router.get('/vacancy/:vacancyId([0-9]+)', checkIsEmployee);
    router.get('/:vacancyId([0-9]+)/start', checkIsEmployee);
    router.get('/:vacancyId([0-9]+)/submit', checkIsEmployee);
    
    router.post('/:id([0-9]+)/question/create', checkIsCompany);
    router.post('/question/:questionId([0-9]+)/answer', checkIsEmployee);
    
    return router;
};
