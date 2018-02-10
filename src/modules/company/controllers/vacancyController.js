const companyService = require('../services/companyService');
const vacancyService = require('../services/vacancyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    router.post('/vacancy', async (req, res) => {
        try {
            let vacancy = await vacancyService.createVacancy(req.user, req.body);
            return res.status(200).send({vacancy: vacancy});
        }
        catch(err) {
            return res.status(500).send({error: err.message});
        }
    });

    return router;

};