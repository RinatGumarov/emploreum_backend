const models = require('../../../core/models');

module.exports.func = (router) => {


    router.get('/', (req, res) => {

        models.users.findAll({
            include: [models.gradation_enums]
        }).then(users => {
            res.send({
                users: users
            })
        });
    });


    return router;

};

