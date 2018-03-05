const models = require('../../../core/models');
const ProfileSkills = models.profile_skills;
let instance;
const Op = models.sequelize.Op;

class ProfileSkillService {

    async findProfileSkill(profileId, skillId) {
        let profileSkill = await ProfileSkills.findOne({
            where: {
                [Op.and]: {
                    profile_id: {
                        [Op.eq]: profileId
                    },
                    skill_id: {
                        [Op.eq]: skillId
                    }
                }
            }
        });
        return profileSkill;
    }

}

instance = new ProfileSkillService();
module.exports = instance;