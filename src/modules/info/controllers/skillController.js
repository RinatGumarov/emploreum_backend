const skillService = require('../services/skillService');

module.exports.func = (router) => {


    router.get('/skills/{profileId}', (req, res) => {
        skillService.findByProfileId(req.params.profileId).then(skills=> {
            res.send({
                skills: skills
            })
        });
    });

    return router;

};

