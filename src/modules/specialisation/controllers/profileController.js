const profileService = require('../services/profilesService');

module.exports.func = (router) => {


    /**
     * получить все специализации
     */
    router.get('/profiles', (req, res) => {

        profileService.all().then(function (profiles) {
            res.send({
                profiles: profiles
            })
        });

    });

    return router;

};

