const profileService = require('../services/profileService');

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

