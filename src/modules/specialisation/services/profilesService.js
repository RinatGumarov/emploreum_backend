const Profiles = require('../../../core/models').profiles;

console.log(Profiles);

class ProfileService {

    all() {
        return Profiles.findAll();
    }

    findOneByName(name) {
        return Profiles.findOne({
            where: {
                name: {
                    [Op.eq]: profileName
                }
            }
        });
    }

}

if (typeof instance !== ProfileService) {
    instance = new ProfileService();
}

module.exports = instance;