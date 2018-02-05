const models = require('../../../core/models');
const Cv = models.cv;
const profilesService = require('../../specialisation/services/profilesService');

let instance;

class CvService {

    /**
     * создание резюме для определенного профиля
     * @param profileName
     * @param employeeId
     * @returns {Promise.<TResult>}
     */
    saveCv(profileName, employeeId) {
        return profilesService.findOneByName(profileName).then((profile) => {
            Cv.build({
                profile_id: profile.id,
                employee_id: employeeId
            })
        })
    }

}

if (typeof instance !== CvService) {
    instance = new CvService();
}

module.exports = instance;