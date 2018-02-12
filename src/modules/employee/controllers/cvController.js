const skillService = require('../../specialisation/services/skillService');
const vacancyService = require('../../company/services/vacancyService');
const cvService = require('../services/cvService');

module.exports.func = (router) => {

    router.get('/cv/:cvId/vacancy/recommended', async (req, res) => {
        let cv = await cvService.getById(req.params.cvId);
        let cvSkills = await skillService.getСvSkills(cv.id);
        let recommendedVacancies = await vacancyService.getRecommended(cvSkills, cv.profile_id);
        res.json(recommendedVacancies);
    });

    return router;
};