const passport = require('passport');

module.exports.func = (router) => {

    router.post('/login',
        passport.authenticate('local'),
        function (req, res) {
            res.json({
                role: req.user.role,
                registrationStep: req.user.status
            });
        });

    return router;

};
