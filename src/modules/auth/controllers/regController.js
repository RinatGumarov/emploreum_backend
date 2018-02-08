const usersService = require('../services/usersService');
const employeesService = require('../../employee/services/employeesService');
const companiesService = require('../../company/services/company-service');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

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
                res.status(200).send(true);
                logger.log(req.session.verifyCode);
            }
        });
    });

    router.post('/signup/2', (req, res) => {
        logger.log(req.session.email);
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
                })
                .catch((error) => {
                    return res.status(500).send(error);
                });
        } else {
            res.status(400).send('code mismatch')
        }
    });

    router.post('/signup/3', (req, res) => {
        switch (req.user.role) {
            case 'EMPLOYEE':
                employeesService.addCvToEmployee(req.user, req.body);
                break;
            case 'COMPANY':
                companiesService.addSpecToCompany(req.user, req.body.specs);
                break;
        }
        if (req.user.status === 1) {
            return usersService.incrementStep(req.user).then((user) => {
                req.user = user;
            }).then(() => {
                return res.send({
                    registrationStep: req.user.status,
                });
            });
        } else {
            return res.send({
                registrationStep: req.user.status,
            });
        }
    });

    router.post('/signup/4', (req, res) => {
        switch (req.user.role) {
            case 'EMPLOYEE':
                employeesService.addNameAndAbout(req.user.id, req.body.name, req.body.about)
                    .then(() => {
                        if (req.user.status === 2) {
                            usersService.incrementStep(req.user).then(() => {
                                return res.send({});
                            });
                        } else {
                            return res.send({});
                        }
                    });
                break;
            case 'COMPANY':
                companiesService.addNameAndAbout(req.user.id, req.body.name, req.body.about)
                    .then(() => {
                        if (req.user.status === 2) {
                            usersService.incrementStep(req.user).then(() => {
                                return res.send({});
                            });
                        } else {
                            return res.send({});
                        }
                    });
                break;
        }
    });

    router.delete('/unreg', (req, res) => {
        usersService.deleteUser(req.user).then((flag) => {
            if (flag) {
                return res.status(200).send(true);
            } else {
                return res.status(500).send('server error');
            }
        });
    });

    return router;

};