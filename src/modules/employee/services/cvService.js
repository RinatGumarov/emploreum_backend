const models = require('../../../core/models');
const Cvs = models.cvs;
const Profiles = models.profiles;
const Op = models.sequelize.Op;

let instance;

class CvsService {
    
    /**
     * создание резюме для определенного профиля
     * определенного работника
     * @param profileId
     * @param employeeId
     * @returns {Promise<Model>}
     */
    async save(profileId, employee) {
        let cvs = await Cvs.findOrCreate({
            where: {
                profile_id: {[Op.eq]: profileId},
                employee_id: {[Op.eq]: employee.id}
            },
            defaults: {
                profile_id: profileId,
                employee_id: employee.id
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