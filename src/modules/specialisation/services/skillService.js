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
                required: true,
                where: {id: {[Op.eq]: id}},
            }]
        });

        return skills;
    }

    async getEmployeeSkills(employeeId) {
        let skills = await Skills.findAll({
            include: [{
                attributes: [],
                model: models.cvs,
                required: true,
                include: {
                    attributes: [],
                    required: true,
                    model: models.employees,
                    where: {
                        id: {[Op.eq]: employeeId}
                    }
                }
            }]
        });
        return skills;
    }


}

if (typeof instance !== SkillService)
    instance = new SkillService();

module.exports = instance;