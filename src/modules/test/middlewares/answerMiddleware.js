const authMiddleware = require('../../auth/middlewares/authMiddleware');
const checkIsEmployee = require('../../employee/middlewares/checkIsEmployeeMiddleware');

module.exports.func = (router) => {

    router.post('/question/:questionId([0-9]+)/answer', checkIsEmployee);
    
    return router;
};
