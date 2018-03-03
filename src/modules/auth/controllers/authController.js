const passport = require('passport');

module.exports.func = (router) => {

    router.post('/login', passport.authenticate('local'), function (req, res) {
        if (req.user.status > 2) {
            res.json({
                userId: req.user.id,
                role: req.user.role
            });
        }
        else {
            res.json({
                userId: req.user.id,
                role: req.user.role,
                registrationStep: req.user.status
            });
        }
    });

    router.get('/logout', async (req, res) => {
        req.session.destroy();
        res.json('success');
    });


    return router;

};
