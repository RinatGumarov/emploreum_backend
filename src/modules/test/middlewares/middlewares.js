const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsCompany = require('../../company/middlewares/checkIsCompanyMiddleware');
const checkIsEmpployee = require('../../employee/middlewares/checkIsEmployeeMiddleware');

module.exports.func = (router) => {

    router.all('*', authMiddleware);
    router.post('/company/create', checkIsCompany);
    router.post('/:id([0-9]+)/question/create', checkIsCompany);
    router.post('/question/:questionId([0-9]+)/answer', checkIsEmpployee);
    router.post('/:vacancyId([0-9]+)/submit', checkIsEmpployee);

    return router;
};
