const companyService = require('../services/companyService');
const balanceService = require('../../blockchain/services/balanceService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    /**
     *  получить компанию, зная сессию.
     */
    router.get('/', async (req, res) => {
        try {
            res.status(200).send(req.user.company);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({ error: err });
        }
    });

    router.post('/update', async (req, res) => {
        try {
            let company = await companyService.update(req.user.id, req.body);
            res.status(200).send({ success: true });
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({ error: err });
        }
    });

    router.get('/indicators', async (req, res) => {
        let company = req.user.company;
        let activeContracts = await companyService.findAllActiveContracts(company);
        let spending = await companyService.countSpending(activeContracts);
        let employeeCount = await companyService.countEmployees(activeContracts);
        let balance = await balanceService.getBalance(req.user.account_address);

        let address = req.user.account_address;
        let canBePaid = Math.floor(balance / spending) || 0;
        return res.send({
            address,
            spending,
            employeeCount,
            balance,
            canBePaid
        });
    });


    /**
     * получить инфу по коипании
     */
    router.get('/info/:id([0-9]+)', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.params.id);
            res.status(200).send(company);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({ error: err });
        }
    });

    /**
     * получить инфу о компании по вокансии
     */
    router.get('/info/vacancy/:id([0-9]+)', async (req, res) => {
        try {
            let company = await companyService.findByVacancyId(req.params.id);
            res.status(200).send(company);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({ error: err });
        }
    });


    router.get('/employees', async (req, res) => {
        try {
            let company = req.user.company;
            res.send(await companyService.findAllEmployees(company));
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send('error');
        }
    });

    router.get('/tests', async (req, res) => {
        try {
            let company = req.user.company;
            let tests = await companyService.findAllTests(company.id);
            res.send(tests);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({ error: 'error' });
        }
    });

    router.get('/transactions', async (req, res) => {
        let company = req.user.company;
        let transactions = await companyService.getAllTransactions(company);
        return res.send(transactions);
    });

    return router;

};