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


    async findProfileSkill(profileId, skillId) {
        return await Profiles.findOne({
            where: {
                profileId: {
                    [Op.eq]: profileId,
                },
                skillId: {
                    [Op.eq]: skillId,
                }
            }
        });
    }
    
}

instance = new ProfileService();
module.exports = instance;