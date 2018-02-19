const authMiddleware = require('../../auth/middlewares/authMiddleware');

module.exports.func = (router) => {

    router.all('*', authMiddleware);

    router.get('/vacancy/:vacancyId([0-9]+)/available', (req, res, next) => {
        if (req.user.role === 'EMPLOYEE')
            return next();
        else
            return res.status(403).send({error: 'only for employee'});

    });

    return router;
};
