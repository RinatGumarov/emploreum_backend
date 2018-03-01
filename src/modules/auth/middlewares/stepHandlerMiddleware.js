// проверяем прошол ли доконца регистрацию юзер
module.exports = (req, res, next) => {
    if (req.user.status < 2) {
        return res.status(403).send({error: 'forbidden'})
    } else {
        return next();
    }
};
