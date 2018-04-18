module.exports = authMiddleware = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(403).send({error: 'unauthorized'});
};
