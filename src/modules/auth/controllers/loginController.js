const passport = require('passport');

module.exports.func = (router) => {
    
    router.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(500).send({success: false, message: 'authentication failed'});
            }
            req.login(user, loginErr => {
                if (loginErr) {
                    return next(loginErr);
                }
                next();
            });
        })(req, res, next);
    }, function (req, res) {
        
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
    
    return router;
    
};
