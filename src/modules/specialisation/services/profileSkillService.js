const models = require('../../../core/models');
const ProfileSkills = models.profileSkills;
let instance;
const Op = models.sequelize.Op;

class ProfileSkillService {
    
    async findProfileSkill(profileId, skillId) {
        
        let profileSkill = await ProfileSkills.findOne({
            where: {
                profileId: {
                    [Op.eq]: profileId,
                },
                skillId: {
                    [Op.eq]: skillId,
                }
            },
            attributes: ["id", "profileId", "skillId"],
        });
        
        return profileSkill;
    }
    
}

instance = new ProfileSkillService();
module.exports = instance;