const companyService = require('../services/companyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    /**
     *  получить компанию, зная сессию.
     */
    router.get('/', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.user.id);
            if (company) {
                logger.log(`Successful get for company ${company.name}`);
                res.status(200).send({company: company});
            } else {
                res.status(400).send({error: `There is no company for user ${req.user.email}`});
            }
        } catch(err){
            logger.error(err);
            res.status(500).send({error: err});
        }
    });

    router.post('/update', async (req, res) => {
        try {
            let company = await companyService.update(req.user.id, req.body);
            res.status(200).send({success: true});
        } catch(err){
            logger.error(err);
            res.status(500).send({error: err});
        }
    });

    return router;

};