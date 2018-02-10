const models = require('../../../core/models');
const Cvs = models.cvs;
const Profiles = models.profiles;
const Employees = models.employees;
const Op = require('sequelize').Op;
const profilesService = require('../../specialisation/services/profilesService');

let instance;

class CvsService {

    /**
     * создание резюме для определенного профиля
     * определенного работника
     * @param profileId
     * @param employeeId
     * @returns {Promise<Model>}
     */
    save(profileId, employeeId) {

        return Cvs.findOrCreate({
            where: {
                profile_id: {[Op.eq]: profileId},
                employee_id: {[Op.eq]: employeeId}
            },
            defaults: {
                profile_id: profileId,
                employee_id: employeeId
            }
        }).then(function (cvs) {
            return cvs[0];
        });
    }

    /**
     * метод  скилов для резюме
     * @param cv
     * @param skill
     * @returns {*}
     */
    addSkill(cv, skill) {
        return cv.addSkills([skill]);
    }

}

if (typeof instance !== CvsService) {
    instance = new CvsService();
}

module.exports = instance;