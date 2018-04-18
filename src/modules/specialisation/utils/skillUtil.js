let instance;

class SkillUtil {

    generateSkillCode(profileId, skillId) {
        return ((profileId - 1) << 12) + (skillId - 1);
    }
}

instance = new SkillUtil();
module.exports = instance;

