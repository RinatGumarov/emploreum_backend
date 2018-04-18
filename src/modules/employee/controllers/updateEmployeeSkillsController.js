const cvService = require('../services/cvService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.post('/skills/update', async (req, res) => {
        try {
            let profiles = req.body;
            for (let i = 0; i < profiles.length; i++) {
                let cv = await cvService.save(profiles[i], req.user.employee);
                for (let j = 0; j < profiles[i].skills.length; j++) {
                    await cvService.addSkill(cv, profiles[i].skills[j]);
                }
            }
            res.json('success');
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could update specifications by auth employee'});
        }
    });
    
    return router;
};
