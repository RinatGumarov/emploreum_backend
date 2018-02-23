const models = require('../../../core/models');
const Profiles = models.profiles;
let instance;
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

instance = new ProfileService();
module.exports = instance;