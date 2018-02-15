const models = require('../../../core/models');
const Profiles = models.profiles;
const Skills = models.skills;

const Op = models.sequelize.Op;
const employeeService = require('../../employee/services/employeeService');

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

    /**
     * @param userId
     * @returns {Promise<*>}
     */
    async getEmployeeSkills(userId) {
        let employee = employeeService.getByUserId(userId);
        let employeeId = employee.id;
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