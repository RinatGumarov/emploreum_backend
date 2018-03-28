const models = require('../../../core/models');
const ProfileSkills = models.profileSkills;

const queryScanner = require('../../../core/queryScanner');
const Op = models.sequelize.Op;

let instance;

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
    
    async getAllForSearch() {
        let queryStr = queryScanner.specialisation.profile_skills;
        let profileSkills = await queryScanner.query(queryStr, {});
        return profileSkills[0];
    }
}

instance = new ProfileSkillService();
module.exports = instance;