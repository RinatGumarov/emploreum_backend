const models = require('../../../core/models');
const Skills = models.skills;
const Profiles = models.profiles;
const Op = require('sequelize').Op;

let instance;

class SkillService {


    /**
     * поиск навыка по профилю
     * @param id
     * @returns {Promise.<Array.<Model>>}
     */
    findByProfileId(id) {
        return Skills.findAll({
            include: [{
                model: Profiles,
                where: {id: {[Op.eq]: id}}
            }]
        });
    }

}

if (typeof instance !== SkillService)
    instance = new SkillService();

module.exports = instance;