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
    
}

if (typeof instance !== ProfileService) {
    instance = new ProfileService();
}

module.exports = instance;