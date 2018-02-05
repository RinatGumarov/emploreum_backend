const models = require('../../../core/models');
module.exports.func = (router) => {


    router.get('/', (req, res) => {
        models.users.findAll({
            include: [
                models.gradation_enums,
                models.achievements
            ]
        }).then(users => {
            req.session.admin = "asdasd";
            res.send({
                users: users
            })
        });
    });

    router.get('/asd', (req, res) => {
        res.send({
            test: req.user
        })
    });

    router.get('/1', (req, res) => {
        res.status(401).send();
    });

    return router;

};

