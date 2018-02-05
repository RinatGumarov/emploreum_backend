const Profiles = require('../../../core/models').profiles;

let instance;

class ProfileService {

    all() {
        return Profiles.findAll();
    }

}

if (typeof instance !== ProfileService)
    instance = new ProfileService();

module.exports = instance;