module.exports = authMiddleware = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(403).send({error: 'unauthorized'});
};

module.exports.func = (router) => {
    router.get('/logout', authMiddleware);
    return router;
};
