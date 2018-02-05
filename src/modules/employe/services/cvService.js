const models = require('../../../core/models');
const Cv = models.cv;
const Profiles = models.profiles;

let instance;

class CvService {

    saveCv(profileName, employeeId) {
        return Profiles.findOne({
            where: {
                name: {
                    [Op.eq]: profileName
                }
            }
        }).then((profile) => {
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