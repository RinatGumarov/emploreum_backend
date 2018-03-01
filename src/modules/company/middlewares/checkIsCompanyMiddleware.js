module.exports = function (req, res, next) {
    if (req.user.role !== 'COMPANY') {
        return res.status(403).send({error: 'only for company'});
    }
    return next();
};
