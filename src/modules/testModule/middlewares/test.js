const passport = require('passport');


module.exports.func = (router) => {

    router.get('*', function (req, res, next) {
        if (req.isAuthenticated()){
            return next();
        }
        console.log('in test midware');
        res.send({error: 'BadTRip'});
    });

    return router;
};

