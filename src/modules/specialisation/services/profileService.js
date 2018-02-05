const Profiles = require('../../../core/models').profiles;

console.log(Profiles);

class ProfileService {

    all() {
        return Profiles.findAll();
    }

}

if (typeof instance !== ProfileService) {
    instance = new ProfileService();
}

module.exports = instance;