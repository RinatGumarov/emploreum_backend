const models = require('../../../core/models');
const Cvs = models.cvs;
const Profiles = models.profiles;
const Op = models.sequelize.Op;

const employeeService = require("./employeeService");
let instance;

class CvsService {
    
    /**
     * создание резюме для определенного профиля
     * определенного работника
     * @param profileId
     * @param employeeId
     * @returns {Promise<Model>}
     */
    async save(profileId, employeeId) {
        let cvs = await Cvs.findOrCreate({
            where: {
                profile_id: {[Op.eq]: profileId},
                employee_id: {[Op.eq]: employeeId}
            },
            defaults: {
                profile_id: profileId,
                employee_id: employeeId
            }
        });
        
        return cvs[0];
    }
    
    /**
     * метод  скилов для резюме
     * @param cv
     * @param skill
     * @returns {*}
     */
    async addSkill(cv, skill) {
        return await cv.addSkills([skill]);
    }
    
    /**
     * @param id
     * @returns {Promise<Model>}
     */
    async getById(id) {
        let cvs = await Cvs.findOne({
            where: {
                id: {[Op.eq]: id}
            }
        });
        return cvs;
    }
    
    /**
     * поиск скилов по направлению работника
     */
    async getEmployeeSkillsWithProfiles(userId) {
        let employee = await employeeService.getByUserId(userId);
        let employeeId = employee.id;
        let skills = await Cvs.findAll({
            include: [
                models.skills,
                models.profiles,
                {
                    attributes: [],
                    required: true,
                    model: models.employees,
                    where: {
                        id: {[Op.eq]: employeeId}
                    }
                }]
        });
        return skills;
    }
    
}

instance = new CvsService();
module.exports = instance;