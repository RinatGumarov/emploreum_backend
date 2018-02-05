const skillService = require('../services/skillsService');

module.exports.func = (router) => {


    /**
     * получить скилы по профилю
     */
    router.get('/skills/:profileId', (req, res) => {
        skillService.findByProfileId(req.params.profileId).then(skills=> {
            res.send({
                skills: skills
            })
        });
    });

    return router;

};

