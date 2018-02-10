const models = require('../../../core/models');
const Profiles = models.profiles;
const Skills = models.skills;
const Op = require('sequelize').Op;

let instance;

class SkillService {

    /**
     * поиск скила по профилю
     * если likestr передан то будет искатьс вхождени в имя
     */
    findByProfileId(id) {
        return Skills.findAll({
            attributes: {exclude: ['profiles']},
            include: [{
                model: Profiles,
                where: {id: {[Op.eq]: id}},
                through: {
                    attributes: []
                }
            }]
        });
    }
}

if (typeof instance !== SkillService)
    instance = new SkillService();

module.exports = instance;