const models = require('../../../core/models');
const Profiles = models.profiles;

const Op = models.sequelize.Op;

class ProfileService {

    /**
     * @returns {Promise<Array<Model>>}
     */
    async all() {
        let profiles = await Profiles.findAll();
        return profiles;
    }

    async getEmployeeProfiles(employeeId, withSkills = false) {
        let options = {
            include: [{
                attributes: [],
                model: models.employees,
                where: {
                    id: {[Op.eq]: employeeId}
                }
            }]
        };

        if (withSkills === true) {
            options.include.push(models.skills)
        }
        let profiles = Profiles.findAll(options);
        return profiles;
    }
}

if (typeof instance !== ProfileService) {
    instance = new ProfileService();
}

module.exports = instance;