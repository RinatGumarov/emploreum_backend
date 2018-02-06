const skillService = require('../services/skillsService');

module.exports.func = (router) => {


    /**
     * получить скилы по профилю
     */
    router.get('/skills/:profileId', (req, res) => {
        // второй параметр передаться только тогда когда будет передан в запросе
        skillService.findByProfileId(req.params.profileId, req.query.like).then(skills=> {
            res.send({
                skills: skills
            })
        });
    });

    return router;

};

