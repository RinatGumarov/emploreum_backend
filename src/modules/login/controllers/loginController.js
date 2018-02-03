const users = require('../../../core/models').users;
const loginService = require('../services/loginService');
const passport = require('passport');

module.exports.func = (router) => {

    router.post('/',
        passport.authenticate('local'),
        function (req, res) {
            res.json({name: 'wefwef', role: 1});
        });

    router.post('/signup', (req, res) => {
        loginService.isEmailFree(req.body.email).then((isFree) => {
            if (!isFree) {
                return res.status(400).send('email is already in use');
            } else {
                if (req.body.password != req.body.confirmPassword) {
                    return res.status(400).send("passwords not equal");
                }
                users
                    .build({email: req.body.email, password: req.body.password})
                    .save()
                    .then((savedEmployee) => {
                        return res.send(savedEmployee);
                    })
                    .catch((error) => {
                        console.log(error);
                        return res.status(500).send(error);
                    });
            }
        });
    });

    return router;

};

