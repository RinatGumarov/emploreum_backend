const logger = require("../../utils/logger");
const workService = require("../../modules/blockchain/services/workService");
const companyService = require("../../modules/company/services/companyService");

let instance;

class Deposit {
    async run() {
        let companies = await companyService.getAll();
        for (let i = 0; i < companies.length; ++i) {
            logger.log(`deposit for ${companies[i].name}`);
            await workService.sendWeekSalaryForAllByCompany(companies[i].id);
        }
        process.exit()
    }
}

instance = new Deposit();
module.exports = instance;