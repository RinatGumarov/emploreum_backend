const models = require('../../../core/models');
const Companies = models.companies;
const CompanyProfiles = models.company_profiles;
const logger = require('../../../utils/logger');

const Op = models.sequelize.Op;

let instance;

class CompaniesService {

    /**
     * сохранение работника и создание для него
     * резюме с определенными специализациями
     * @param companyId
     * @param profileId
     */
    async addSpecToCompany(companyId, profileId) {
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
}

if (typeof instance !== CompaniesService) {
    instance = new CompaniesService();
}

module.exports = instance;