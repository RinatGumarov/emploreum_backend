const models = require('../../../core/models');
const ProfileSkills = models.profileSkills;
let instance;
const Op = models.sequelize.Op;

class ProfileSkillService {

    async findProfileSkill(profileId, skillId) {
        return await ProfileSkills.findOne({
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

instance = new ProfileSkillService();
module.exports = instance;