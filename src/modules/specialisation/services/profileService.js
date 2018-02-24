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


    async findProfileSkill(profileId, skillId) {
        return await models.profile_skills.findOne({
            where: {
                profile_id: {
                    [Op.eq]: profileId,
                },
                skill_id: {
                    [Op.eq]: skillId,
                }
            }
        });
    }
    
}

if (typeof instance !== ProfileService) {
    instance = new ProfileService();
}

module.exports = instance;