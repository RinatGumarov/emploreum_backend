const usersService = require('../services/userService');
const employeesService = require('../../employee/services/employeeService');
const companiesService = require('../../company/services/companyService');

const logger = require('../../../utils/logger');
const account = require('../../blockchain/utils/account');
const web3 = require('../../blockchain/utils/web3');


module.exports.func = (router) => {
    
    /**
     * шаг проверки высланного кода на почту
     * если пароль верный то регистрируем и аунтифицируем
     * пользователя
     */
    router.post('/signup/verification', async (req, res) => {
        try {
            if (req.session.verifyCode === parseInt(req.body.verifyCode)) {
                
                let user = await usersService.saveUser(
                    req.session.email,
                    req.session.password,
                    req.session.role
                );
                
                switch (req.session.role) {
                    case 'EMPLOYEE':
                        await employeesService.save(user.id);
                        break;
                    case 'COMPANY':
                        await companiesService.save(user.id);
                        break;
                }
                
                req.login(user, (err) => {
                    if (err) {
                        res.status(401).json({error: 'Unauthorized'});
                    } else {
                        res.json({
                            registrationStep: user.status,
                            role: req.session.role,
                            userId: req.user.id
                        });
                    }
                });
            } else {
                res.status(400).json('code mismatch');
            }
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err.message});
        }
    });
    
    return router;
    
};
