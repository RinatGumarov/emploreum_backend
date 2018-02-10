const models = require('../../../core/models');
const Profiles = models.profiles;
const Op = require('sequelize').Op;

console.log(Profiles);


class ProfileService {

    /**
     * @param likeStr
     * @returns {Promise<Array<Model>>}
     */
    all() {
        return Profiles.findAll();
    }
}

if (typeof instance !== ProfileService) {
    instance = new ProfileService();
}

module.exports = instance;