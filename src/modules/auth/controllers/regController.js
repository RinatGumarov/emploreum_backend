const usersService = require('../services/usersService');
const employeesService = require('../../employee/services/employeesService');
const companiesService = require('../../company/services/company-service');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    /**
     * уввеличивать статус пользователя пока все не заполнит
     * является функцией вызова promise
     * @param req
     * @param res
     * @returns {Function}
     */
    getIncremenstPromis = function (req, res) {
        return function () {
            if (req.user.status < 3) {
                return usersService.incrementStep(req.user).then((user) => {
                    req.user = user;
                }).then(() => {
                    return res.json({
                        registrationStep: req.user.status,
                    });
                });
            } else {
                return res.json({
                    registrationStep: req.user.status,
                });
            }
        }
    };

    /**
     * шаг регистрации с высыланием проверочного кода на почту
     */
    router.post('/signup/1', (req, res) => {
        usersService.isEmailFree(req.body.email).then((isFree) => {
            if (!isFree) {
                return res.status(400).send('email is already in use');
            } else {

                if (String(req.body.password) !== String(req.body.passwordConfirmation)) {
                    return res.status(400).send("passwords not equal");
                }

                req.session.email = req.body.email;
                req.session.password = req.body.password;
                req.session.role = req.body.role;
                req.session.verifyCode = usersService.sendCodeToUser(req.body.email);
                res.json({data: "success"});

                logger.log(req.session.verifyCode);
            }
        });
    });

    /**
     * шаг проверки высланного кода на почту
     * если пароль верный то регистрируем и аунтифицируем
     * пользователя
     */
    router.post('/signup/2', (req, res) => {
        logger.log(req.session.email);
        try {
            if (req.session.verifyCode === parseInt(req.body.verifyCode)) {
                usersService.saveUser(req.session.email, req.session.password, req.session.role, 1)
                    .then((user) => {
                        req.login(user, (err) => {
                            if (err) {
                                res.status(401).send({error: 'Unauthorized'});
                            } else {
                                res.send({
                                    registrationStep: user.status,
                                    role: user.role
                                })
                            }
                        });
                    });
            } else {
                res.status(400).send('code mismatch')
            }
        } catch (err) {
            res.status(500).json({
                error: err.message
            })
        }
    });

    /**
     * Шаг заполнения скилов и профилей компании
     * или работника
     */
    router.post('/signup/3', (req, res) => {
        try {
            let result;
            switch (req.user.role) {
                case 'EMPLOYEE':
                    resultPrimuse = employeesService.addCvToEmployee(req.user, req.body)
                        .then(getIncremenstPromis(req, res));
                    break;
                case 'COMPANY':
                    resultPrimuse = companiesService.addSpecToCompany(req.user, req.body.specs)
                        .then(getIncremenstPromis(req, res));
                    break;
            }
        } catch (err) {
            res.status(500).json({
                error: err.message
            })
        }
    });

    /**
     * шаг заполнения лично информации
     */
    router.post('/signup/4', (req, res) => {

        try {
            switch (req.user.role) {
                case 'EMPLOYEE':
                    employeesService.addNameAndAbout(req.user.id, req.body.name, req.body.about)
                        .then(getIncremenstPromis(req, res));
                    break;
                case 'COMPANY':
                    companiesService.addNameAndAbout(req.user.id, req.body.name, req.body.about)
                        .then(getIncremenstPromis(req, res));
                    break;
            }
        } catch (err) {
            res.status(500).json({
                error: err.message
            })
        }
    });

    /**
     * метод удаления пользователя из системы
     */
    router.delete('/unreg', (req, res) => {
        usersService.deleteUser(req.user).then((deleted) => {
            if (deleted) {
                return res.json({data: "success"});
            } else {
                return res.status(500).send('server error');
            }
        });
    });

    return router;

};