module.exports = function (req, res, next) {
    if (req.user.role !== 'EMPLOYEE') {
        return res.status(403).send({error: 'only for employee'});
    }
    return next();
};

