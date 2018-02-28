const models = require('../../../core/models');
const Cvs = models.cvs;
const Profiles = models.profiles;
const Op = models.sequelize.Op;

let instance;

class CvsService {
    
    /**
     * создание резюме для определенного профиля
     * определенного работника
     * @param profile
     * @param employee
     * @returns {Promise<Model>}
     */
    async save(profile, employee) {
        let cvs = await Cvs.findOrCreate({
            where: {
                profile_id: {[Op.eq]: profile.id},
                employee_id: {[Op.eq]: employee.id}
            },
            defaults: {
                profile_id: profile.id,
                employee_id: employee.id
            }
        });
        
        return cvs[0];
    }
    
    /**
     * метод  скилов для резюме
     * @param cv
     * @param skill
     * @returns {Promise<*>}
     */
    async addSkill(cv, skill) {
        let result = await cv.addSkills([skill.id]);
        return result[0];
    }
    
    /**
     * получить профиль работника по id
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
     * поиск профилей рабоника
     * со скилами
     * */
    async getEmployeeSpecification(employeeUserId) {
        let cvs = await Cvs.findAll({
            include: [
                models.skills,
                models.profiles,
                {
                    attributes: [],
                    required: true,
                    model: models.employees,
                    where: {
                        id: {[Op.eq]: employeeUserId}
                    }
                }]
        });
        return cvs;
    }
    
}

instance = new CvsService();
module.exports = instance;