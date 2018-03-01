const models = require('../../../core/models');
const ProfileSkills = models.profile_skills;
let instance;
const Op = models.sequelize.Op;

class ProfileSkillService {

    async findProfileSkill(profileId, skillId) {
        return await ProfileSkills.findOne({
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

instance = new ProfileSkillService();
module.exports = instance;