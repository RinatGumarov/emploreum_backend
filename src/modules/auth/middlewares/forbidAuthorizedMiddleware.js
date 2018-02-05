module.exports.func = (router) => {

    router.post('/login', (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.status(403).send({error: 'forbidden'});
    });

    return router;
};
