const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('../../employee/middlewares/checkIsEmployeeMiddleware');
const checkIsCompany = require('../../company/middlewares/checkIsCompanyMiddleware');

module.exports.func = (router) => {

    router.post('/:testId([0-9]+)/question/create', checkIsCompany);
    
    return router;
};
