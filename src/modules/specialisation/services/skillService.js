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

    /**
     * поиск скила по работнику
     */
    async getEmployeeSkills(employeeId) {
        let skills = await Skills.findAll({
            include: [{
                attributes: [],
                model: models.cvs,
                as: "cvs",
                include: {
                    attributes: [],
                    as: "employee",
                    model: models.employees,
                    where: {
                        id: {[Op.eq]: employeeId}
                    }
                }
            }]
        });
        return skills;
    }

    /**
     * поиск скилов по резюме раотника
     * @returns {Promise<*>}
     * @param cvId
     */
    async getСvSkills(cvId) {
        let skills = await Skills.findAll({
            include: [{
                attributes: [],
                model: models.cvs,
                as: "cvs",
                attributes: [],
                where: {
                    id: {[Op.eq]: cvId}
                }
            }]
        });

        return skills;
    }
}

if (typeof instance !== SkillService)
    instance = new SkillService();

module.exports = instance;