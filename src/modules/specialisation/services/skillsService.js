const models = require('../../../core/models');
const Profiles = models.profiles;
const Skills = models.skills;

const Op = models.sequelize.Op;

let instance;

class SkillService {

    /**
     * поиск скила по профилю
     * если likestr передан то будет искатьс вхождени в имя
     */
    async findByProfileId(id) {
        let skills = await Skills.findAll({
            attributes: ['id', 'name', 'parent_id', "photo_path"],
            include: [{
                attributes: [],
                model: Profiles,
                where: {id: {[Op.eq]: id}},
            }]
        });

        return skills;
    }
}

if (typeof instance !== SkillService)
    instance = new SkillService();

module.exports = instance;