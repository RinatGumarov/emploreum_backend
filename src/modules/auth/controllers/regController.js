const loginService = require('../services/loginService');
const employeesService = require('../../employee/services/employeesService');
const passport = require('passport');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    router.post('/signup/1', (req, res) => {
        loginService.isEmailFree(req.body.email).then((isFree) => {
            if (!isFree) {
                return res.status(400).send('email is already in use');
            } else {
                if (String(req.body.password) !== String(req.body.passwordConfirmation)) {
                    return res.status(400).send("passwords not equal");
                }
                req.session.email = req.body.email;
                req.session.password = req.body.password;
                req.session.role = req.body.role;
                req.session.verifyCode = loginService.sendCodeToUser(req.body.email);
                res.status(200).send();
                logger.log(req.session.verifyCode);
            }
        });
    });

    router.post('/signup/2', (req, res) => {
        logger.log(req.session.email);
        if (req.session.verifyCode === parseInt(req.body.verifyCode)) {
            loginService.saveUser(req.session.email, req.session.password, req.session.role, 1)
                .then((user) => {
                    req.login(user, (err) => {
                        if (err) {
                            res.status(401).send({error: 'Unauthorized'});
                        } else {
                            res.send({
                                registrationStep: user.status,
                                role: user.role,
                            })
                        }
                    });
                })
                .catch((error) => {
                    logger.log(error);
                    return res.status(500).send(error);
                });
        } else {
            res.status(400).send({error: 'code mismatch'})
        }
    });

    router.post('/signup/3', (req, res) => {
        employeesService.addCvToEmployee(req.user, req.body);
        if (req.user.status === 1)
            loginService.incrementStep(req.user);
        loginService.getUserById(req.user.id)
            .then((user) => {
                return res.send({
                    registrationStep: user.status,
                })
            })
    });

    return router;

};