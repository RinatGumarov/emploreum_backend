const companyService = require('../services/companyService');
const vacancyService = require('../services/vacancyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    router.post('new_vacancy', (req, res) => {
        vacancyService.createVacancy(req.user, [], []).then((vacancy) => {
            return res.status(200).send({vacancy: vacancy});
        });
    });

    return router;

};