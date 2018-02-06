const profileService = require('../services/profilesService');

module.exports.func = (router) => {


    /**
     * получить все специализации
     * @var like - вхождения в имя
     */
    router.get('/profiles', (req, res) => {

        // если req.query.like не передан то будет считать что в функию ничего не передается
        profileService.all(req.query.like).then(function (profiles) {
            res.send({
                profiles: profiles.map((elem) => elem.name)
            })
        });

    });

    return router;

};

