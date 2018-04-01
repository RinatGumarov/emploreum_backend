const passport = require('passport');

module.exports.func = (router) => {

    router.post('/login', passport.authenticate('local'), function (req, res) {
        
        if (req.user.status > 2) {
            let name;
            let photoPath;
           
            if (req.user.role === 'EMPLOYEE') {
                name = req.user.employee.name;
                photoPath = req.user.employee.photo_path;
            } else {
                name = req.user.company.name;
                photoPath = req.user.company.logo;
            }
            res.json({
                userId: req.user.id,
                role: req.user.role,
                name,
                photoPath
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
