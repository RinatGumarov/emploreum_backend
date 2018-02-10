const passport = require('passport');

module.exports.func = (router) => {

    router.post('/login', passport.authenticate('local'), function (req, res) {
        res.json({
            role: req.user.role,
            registrationStep: req.user.status
        });
    });

    router.get('/logout', function (req, res) {
        req.logout();
        res.send(true);
    });


    return router;

};
