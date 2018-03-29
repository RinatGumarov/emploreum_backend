const models = require('../../../core/models');
const Profiles = models.profiles;
const Skills = models.skills;
const vacancyService = require('../../company/services/vacancyService');
const skillUtil = require('../utils/skillUtil');

const Op = models.sequelize.Op;

let instance;

class SkillService {

    /**
     * поиск скила по профилю
     * если likestr передан то будет искатьс вхождени в имя
     */
    async findByProfileId(id) {
        let skills = await Skills.findAll({
            attributes: ['id', 'name', 'parentId', 'photoPath'],
            include: [{
                attributes: [],
                model: Profiles,
                required: true,
                where: { id: { [Op.eq]: id } }
            }]
        });

        return skills;
    }

    /**
     * @returns {Promise<*>}
     * @param employee
     */
    async getEmployeeSkills(employee) {
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
                        id: { [Op.eq]: employeeId }
                    }
                }
            }]
        });
        return skills;
    }

    async generateSkillCodesByVacancy(vacancyId) {
        let skillCodes = [];
        let profiles = await vacancyService.getVacancySpecification(vacancyId);
        for (let profile of profiles) {
            for (let skill of profile.skills) {
                let code = skillUtil.generateSkillCode(profile.id, skill.id);
                skillCodes.push(code);
            }
        }

        return skillCodes;
    }
}

instance = new SkillService();
module.exports = instance;