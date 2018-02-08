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
    addSpecToCompany(user, specs) {
        Companies.findOrCreate({
            where:{
                user_id: {
                    [Op.eq]: user.id
                }
            },
            defaults: {
                user_id: user.id
            }
        }).then((company) => {
                logger.log(company[0]);
                specs.forEach((value, index, array) => {
                    profilesService.findOneByName(value)
                        .then((profile) => {
                            CompanyProfiles.build({
                                company_id: company[0].id,
                                profile_id: profile.id
                            }).save().then((companyProfile) => {
                                    logger.log(companyProfile);
                                    return companyProfile;
                                }
                            )
                        });
                });
            }
        );
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


}

if (typeof instance !== CompaniesService) {
    instance = new CompaniesService();
}

module.exports = instance;