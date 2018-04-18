const companyService = require('../services/companyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/transactions', async (req, res) => {
        try {
            let company = req.user.company;
            let transactions = await companyService.getAllTransactions(company);
            return res.json(transactions);
        } catch (err) {
            logger.error(err.stack);
            res.status(500)
                .json({error: err});
        }
    });
    
    return router;
    
};
