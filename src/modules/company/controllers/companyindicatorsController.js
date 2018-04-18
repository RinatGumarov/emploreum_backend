const companyService = require('../services/companyService');
const balanceService = require('../../blockchain/services/balanceService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {

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
            res.status(500)
                .json({ error: err.msg });
        }
    });

    return router;

};
