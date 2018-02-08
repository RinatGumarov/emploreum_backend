const models = require('../../../core/models');
const Cv = models.cvs;
const profilesService = require('../../specialisation/services/profilesService');

let instance;

class CvsService {

    /**
     * создание резюме для определенного профиля
     * определенного работника
     * @param profileName
     * @param skills
     * @param employeeId
     * @returns {Promise.<Cv>}
     */
    saveCv(profileName, skills, employeeId) {
        return profilesService.findOneByName(profileName).then((profile) => {
            return Cv.build({
                profile_id: profile.id,
                employee_id: employeeId
            }).save();
        })
    }

}

if (typeof instance !== CvsService) {
    instance = new CvsService();
}

module.exports = instance;