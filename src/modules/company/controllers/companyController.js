const companyService = require('../services/companyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    /**
     *  получить компанию, зная сессию.
     */
    router.get('/', (req, res) => {
        companyService.findByUserId(req.user.id)
            .then((company) => {
                if (company) {
                    logger.log(`Successful get for company ${company.name}`);
                    res.status(200).send({company: company});
                }
                else {

                    res.status(400).send({error: `There is no company for user ${req.user.email}`});
                }
            })
            .catch((err) => {
                logger.error(err);
                res.status(500).send({error: err});
            });
    });

    router.post('/changeAbout', (req, res) => {
        companyService.changeAbout(req.user.id, req.body.about)
            .then((company) => {
                logger.log(`\'About\' field changed for company ${company.name}`);
                res.status(200).send({success: true});
            })
            .catch((err) => {
                logger.error(err);
                res.status(500).send({error: err});
            })
    });

    return router;

};