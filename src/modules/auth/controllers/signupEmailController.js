const usersService = require('../services/userService');
const messageService = require('../../message/services/messageService');
const logger = require('../../../utils/logger');

const validate = require('express-jsonschema').validate;
const validationSchema = require("../validations/signupEmailValidation");

module.exports.func = (router) => {
    
    /** шаг регистрации с высыланием проверочного кода на почту */
    router.post('/signup/email',
        
        validate({body: validationSchema}),
        
        async (req, res) => {
            if (!(await usersService.isEmailFree(req.body.email))) {
                res.status(400).json('email is already in use');
            } else {
                
                if (String(req.body.password) !== String(req.body.passwordConfirmation)) {
                    return res.status(400).json('passwords not equal');
                }
                
                req.session.email = req.body.email;
                req.session.password = req.body.password;
                req.session.role = req.body.role;
                req.session.verifyCode = messageService.sendCodeToUser(req.body.email);
                res.json({data: 'success'});
                
                logger.log(req.session.verifyCode);
            }
        });
    
    return router;
    
};
