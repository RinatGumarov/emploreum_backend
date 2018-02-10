const models = require('../../../core/models');
const Employees = models.employees;
const Users = models.users;
const cvService = require('./cvsService');
const profileService = require('../../specialisation/services/profilesService');
const skillsService = require('../../specialisation/services/skillsService');
const Op = require('sequelize').Op;

let instance;

class EmployeesService {

    /**
     * сохранение работника и создание для него
     * резюме с определенными специализациями
     * @param userId
     * @param profiles
     */
    save(userId, profiles) {

        return Employees.findOrCreate({
            where: {
                user_id: {[Op.eq]: userId}
            },
            defaults: {
                user_id: userId
            }
        }).then((savedEmployee) => {
                let employee = savedEmployee[0];
                // резюмэ по разным профилям
                Object.keys(profiles).forEach((profileName) =>
                    profileService.findOneByName(profileName).then((profile) =>
                        //сохроняем резюме
                        cvService.save(profile.id, employee.id)
                            .then((cv) => {
                                let skills = profiles[profileName];
                                //сохрроняем скилы
                                for (let i = 0; i < skills.length; i++) {
                                    skillsService.findByName(skills[i]).then((skill) =>
                                        cvService.addSkill(cv, skill)
                                    )
                                }
                            })
                    )
                );
            }
        );
    }

    /**
     * @param userId
     * @param name
     * @param about
     * @returns {Promise<Model>}
     */
    addNameAndAbout(userId, name, about) {
        return Employees.findOne({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            }
        }).then((employee) => {
            employee.name = name;
            employee.about = about;
            employee.save();
        });
    }


}

if (typeof instance !== EmployeesService) {
    instance = new EmployeesService();
}

module.exports = instance;