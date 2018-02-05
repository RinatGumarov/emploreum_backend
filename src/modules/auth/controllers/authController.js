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
            users
                .build({
                    email: req.session.email,
                    password: req.session.password,
                    role: req.session.role,
                    status: 2,
                })
                .save()
                .then((user) => {
                    req.login(user, (err) => {
                        if (err) {
                            res.status(401).send({error: 'Unauthorized'});
                        } else {
                            res.send({
                                user: user
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
        Object.keys(req.body).forEach(function(item, i, arr){
            logger.log(item);
        });
       res.end();
    });

    return router;

};
