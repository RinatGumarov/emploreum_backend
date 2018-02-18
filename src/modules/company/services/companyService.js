const models = require('../../../core/models');
const Companies = models.companies;
const CompanyProfiles = models.company_profiles;
const Account = require('../../blockchain/utils/account');
const logger = require('../../../utils/logger');

const Op = models.sequelize.Op;
const Web3InitError = require("../../blockchain/utils/Web3Error");
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
    
    async findByUserIdWithUser(id) {
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
    
    async createBlockchainAccountForCompany(name, rating, address) {
        let blockchainCompany = {
            name,
            rating,
            address,
        };
        let contract = await Account.registerCompany(blockchainCompany).then(result => {
            if (!result)
                throw new Web3InitError('Could not register company in blockchain');
            return result;
        });
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
}

if (typeof instance !== CompaniesService) {
    instance = new CompaniesService();
}

module.exports = instance;