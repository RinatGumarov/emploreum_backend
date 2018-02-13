const models = require('../../../core/models');
const Cvs = models.cvs;
const Profiles = models.profiles;
const Op = models.sequelize.Op;

let instance;

class CvsService {

    /**
     * создание резюме для определенного профиля
     * определенного работника
     * @param profileId
     * @param employeeId
     * @returns {Promise<Model>}
     */
    async save(profileId, employeeId) {
        let cvs = await Cvs.findOrCreate({
            where: {
                profile_id: {[Op.eq]: profileId},
                employee_id: {[Op.eq]: employeeId}
            },
            defaults: {
                profile_id: profileId,
                employee_id: employeeId
            }
        });

        return cvs[0];
    }

    /**
     * метод  скилов для резюме
     * @param cv
     * @param skill
     * @returns {*}
     */
    async addSkill(cv, skill) {
        return await cv.addSkills([skill]);
    }

    /**
     * @param id
     * @returns {Promise<Model>}
     */
    async getById(id) {
        let cvs = await Cvs.findOne({
            where: {
                id: {[Op.eq]: id}
            }
        });
        return cvs;
    }

}

if (typeof instance !== CvsService) {
    instance = new CvsService();
}

module.exports = instance;