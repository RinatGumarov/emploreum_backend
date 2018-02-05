const authMiddleware = require('./authMiddleware');

module.exports.func = (router) => {

    router.post('/signup/3', authMiddleware, (req, res, next) => {
        if (req.user.status < 1){
            res.status(403).send({error: 'forbidden'})
        } else {
            next();
        }
    });

    router.post('/signup/4', authMiddleware, (req, res, next) => {
        if (req.user.status < 2){
            res.status(403).send({error: 'forbidden'})
        } else {
            next();
        }
    });

    return router;
};
