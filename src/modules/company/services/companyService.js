const models = require('../../../core/models');
const Companies = models.companies;
const CompanyProfiles = models.company_profiles;

const Op = models.sequelize.Op;

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
    
    async findByVacancyId(vacancyId) {
        return await Companies.findOne({
            
            include: [{
                attributes: [],
                required: true,
                model: models.vacancies,
                where: {
                    id: {[Op.eq]: vacancyId}
                }
            }]
        })
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