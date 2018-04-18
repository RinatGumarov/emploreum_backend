const cvService = require('../../employee/services/cvService');
const companiesService = require('../../company/services/companyService');

const logger = require('../../../utils/logger');
const status = require('../utils/status');

module.exports.func = (router) => {
    
    /** Шаг заполнения скилов и профилей */
    router.post('/signup/specification', async (req, res) => {
        let user = req.user;
        try {
            // profiles - объекты класса профиль, содержащие скиллы.
            let profiles = req.body.specifications;
            switch (user.role) {
                case 'EMPLOYEE':
                    for (let i = 0; i < profiles.length; i++) {
                        let cv = await cvService.save(profiles[i], user.employee);
                        for (let j = 0; j < profiles[i].skills.length; j++) {
                            await cvService.addSkill(cv, profiles[i].skills[j]);
                        }
                    }
                    break;
                case 'COMPANY':
                    let company = await companiesService.save(user.id);
                    for (let i = 0; i < profiles.length; ++i) {
                        await companiesService.addProfileToCompany(company.id, profiles[i].id);
                    }
                    break;
            }
            let respObj = await status.incrementStatusAndReturnResponse(user);
            res.status(200).json(respObj);
            
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err.message});
        }
    });
    
    return router;
};
