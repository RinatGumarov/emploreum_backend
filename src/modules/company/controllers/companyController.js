const companyService = require('../services/companyService');
const balanceService = require('../../blockchain/services/balanceService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /**
     *  получить компанию, зная сессию.
     */
    router.get('/', async (req, res) => {
        try {
            res.status(200).json(req.user.company);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    router.post('/update', async (req, res) => {
        try {
            let company = await companyService.update(req.user.id, req.body);
            res.status(200).json({success: true});
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    router.get('/indicators', async (req, res) => {
        try {
            let company = req.user.company;
            let activeContracts = await companyService.findAllActiveContracts(company);
            let spending = await companyService.countSpending(activeContracts);
            let employeeCount = await companyService.countEmployees(activeContracts);
            let balance = await balanceService.getBalance(req.user.accountAddress);
            let address = req.user.accountAddress;
            let canBePaid = Math.floor(balance / spending) || 0;
            return res.json({
                address,
                spending,
                employeeCount,
                balance,
                canBePaid
            });
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    
    /**
     * получить инфу по коипании
     */
    router.get('/info/:id([0-9]+)', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.params.id);
            res.status(200).json(company);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    /**
     * получить инфу о компании по вокансии
     */
    router.get('/info/vacancy/:id([0-9]+)', async (req, res) => {
        try {
            let company = await companyService.findByVacancyId(req.params.id);
            res.status(200).json(company);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    
    router.get('/employees', async (req, res) => {
        try {
            let company = req.user.company;
            res.json(await companyService.findAllEmployees(company));
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json('error');
        }
    });
    
    router.get('/tests', async (req, res) => {
        try {
            let company = req.user.company;
            let tests = await companyService.findAllTests(company.id);
            res.json(tests);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    router.get('/transactions', async (req, res) => {
        try {
            let company = req.user.company;
            let transactions = await companyService.getAllTransactions(company);
            return res.json(transactions);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    return router;
    
};