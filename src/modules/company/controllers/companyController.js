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
        } catch (err) {
            logger.error(err);
            res.status(500).send({error: err});
        }
    });
    
    router.post('/update', async (req, res) => {
        try {
            let company = await companyService.update(req.user.id, req.body);
            res.status(200).send({success: true});
        } catch (err) {
            logger.error(err);
            res.status(500).send({error: err});
        }
    });

    router.get('/address', async (req, res) => {
       return res.send(req.user.address);
    });


    /**
     * получить инфу по коипании
     */
    router.get('/info/:id([0-9]+)', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.params.id);
            res.status(200).send({company: company});
        } catch (err) {
            logger.error(err);
            res.status(500).send({error: err});
        }
    });
    
    /**
     * получить инфу о компании по вокансии
     */
    router.get('/info/vacancy/:id([0-9]+)', async (req, res) => {
        try {
            let company = await companyService.findByVacancyId(req.params.id);
            res.status(200).send({company: company});
        } catch (err) {
            logger.error(err);
            res.status(500).send({error: err});
        }
    });


    router.get('/employees', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.user.id);
            res.send(await companyService.findAllEmployees(company.id));
        } catch(err){
            logger.error(err);
            res.status(500).send("errore=(");
        }
    });
    
    return router;
    
};