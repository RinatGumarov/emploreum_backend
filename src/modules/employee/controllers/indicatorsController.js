const employeeService = require('../services/employeeService');
const balanceService = require('../../blockchain/services/balanceService');

module.exports.func = (router) => {
    
    router.get('/indicators', async (req, res) => {
        let endedContractsCount = await employeeService.countEndedWorks(req.user.employee);
        let currentContractsCount = await employeeService.countCurrentWorks(req.user.employee);
        let income = await employeeService.getIncome(req.user.employee);
        let balance = await balanceService.getBalance(req.user.accountAddress);
        res.send({
            endedContractsCount,
            currentContractsCount,
            income,
            balance,
            address: req.user.accountAddress
        });
    });
    
    return router;
};
