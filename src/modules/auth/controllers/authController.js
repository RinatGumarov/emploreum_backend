const users = require('../../../core/models').users;
const loginService = require('../services/loginService');
const passport = require('passport');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    router.post('/login',
        passport.authenticate('local'),
        function (req, res) {
            res.json({
                name: 'wefwef',
                role: 'employee',
                step: 1,
            });
        });

    router.post('/signup/1', (req, res) => {
        loginService.isEmailFree(req.body.email).then((isFree) => {
            if (!isFree) {
                return res.status(400).send('email is already in use');
            } else {
                if (req.body.password != req.body.passwordConfirmation) {
                    return res.status(400).send("passwords not equal");
                }
                req.session.email = req.body.email;
                req.session.password = req.body.password;
                req.session.role = req.body.role;
                req.session.verifyCode = loginService.sendCodeToUser(req.body.email);
                res.status(200).send();
            }
        });
    });

    router.post('/signup/2', (req, res) => {
        logger.log(req.session.email);
        if (req.session.verifyCode === parseInt(req.body.verifyCode)) {
            users
                .build({email: req.session.email, password: req.session.password})
                .save()
                .then((savedEmployee) => {
                    return res.send(savedEmployee);
                })
                .catch((error) => {
                    console.log(error);
                    return res.status(500).send(error);
                });
        } else {
          res.status(400).send({ error: 'code mismatch' })
        }
    });

    return router;

};
