const models = require('../../../core/models');
const Companies = models.companies;
const CompanyProfiles = models.company_profiles;
const Account = require('../../work/utils/account');
const blockchainInfo = require('../../work/services/blockchainEventService');
const logger = require('../../../utils/logger');
const _ = require('lodash');

const Op = models.sequelize.Op;
const Web3InitError = require("../../work/utils/Web3Error");
let instance;

class CompaniesService {

    /**
     * создание профиля для компании
     * @param companyId
     * @param profileId
     */
    async addProfileToCompany(companyId, profileId) {
        return await CompanyProfiles.create({
            company_id: companyId,
            profile_id: profileId
        });
    }

    async save(userId) {
        return (await Companies.findOrCreate({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            },
            defaults: {
                user_id: userId
            }
        }))[0];
    }

    async update(userId, params) {
        return await Companies.update(params, {
            where: {
                user_id: {[Op.eq]: userId}
            }
        });
    }

    async findByUserId(userId) {
        return await Companies.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId,
                },
            },
        })
    }

    async findByIdWithUser(id) {
        return await Companies.findOne({
            include: [{
                model: models.users,
            }],
            where: {
                id: {
                    [Op.eq]: id,
                },
            },
        })
    }

    async hasContracts(companyId) {
        let works = await models.works.find({
            where: {
                company_id: {
                    [Op.eq]: companyId,
                },
            },
        });
        return works !== null;
    }

    async createBlockchainAccountForCompany(companyUserId, company, name, rating, address) {
        let blockchainCompany = {
            name,
            rating,
            address,
        };
        await blockchainInfo.set(companyUserId, `company${address}`, `creating contract for company ${company.name}`);
        let contract = await Account.registerCompany(blockchainCompany).then(async (result) => {
            if (!result)
                throw new Web3InitError('Could not register company in blockchain');
            await blockchainInfo.unset(companyUserId, `company${address}`);
            return result;
        });
        company.contract = contract.address;
        company.save();

        return contract;
    }

    async findByVacancyId(vacancyId) {
        return await Companies.findOne({
            include: [models.users, {
                attributes: [],
                required: true,
                model: models.vacancies,
                where: {
                    id: {[Op.eq]: vacancyId}
                }
            }]
        });
    }

    async findById(id) {
        return await Companies.findOne({
            where: {
                id: {
                    [Op.eq]: id,
                },
            },
        })
    }

    async findAllEmployees(companyId) {
        let employees = await models.works.findAll({
            attributes: [],
            distinct: "company_id",
            where: {
                company_id: {
                    [Op.eq]: companyId,
                },
            },
            include: [{
                attributes: ["photo_path", "name", "user_id"],
                model: models.employees,
            }],
        });
        return _.uniqBy(employees, 'employee.user_id');
    }
}

if (typeof instance !== CompaniesService) {
    instance = new CompaniesService();
}

module.exports = instance;