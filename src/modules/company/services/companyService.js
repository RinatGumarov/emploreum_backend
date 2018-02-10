const models = require('../../../core/models');
const Companies = models.companies;
const CompanyProfiles = models.company_profiles;
const logger = require('../../../utils/logger');
const Op = require('sequelize').Op;
const profilesService = require('../../specialisation/services/profilesService');

let instance;

class CompaniesService {

    /**
     * сохранение работника и создание для него
     * резюме с определенными специализациями
     * @param user
     * @param specs
     */
    async addSpecToCompany(user, specs) {
        let company = (await Companies.findOrCreate({
            where: {
                user_id: {
                    [Op.eq]: user.id
                }
            },
            defaults: {
                user_id: user.id
            }
        }))[0];
        logger.log(company);
        specs.forEach(async (value) => {
            let profile = await profilesService.findOneByName(value);
            let companyProfile = await CompanyProfiles.build({
                company_id: company.id,
                profile_id: profile.id
            }).save();
            logger.log(companyProfile);
        });
        return company;
    }

    addNameAndAbout(userId, name, about) {
        return Companies.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            }
        }).then((company) => {
            company.name = name;
            company.about = about;
            return company.save();
        });
    }

    findByUserId(userId) {
        return Companies.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId,
                },
            },
        })
    }

    changeAbout(userId, about) {
        return Companies.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            }
        }).then((company) => {
            company.about = about;
            return company.save();
        });
    }

    changeName(userId, name) {
        return Companies.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            }
        }).then((company) => {
            company.name = name;
            return company.save();
        });
    }


}

if (typeof instance !== CompaniesService) {
    instance = new CompaniesService();
}

module.exports = instance;