const models = require('../../../core/models');
const Employees = models.employees;
const Users = models.users;
const cvService = require('./cvsService');
const usersService = require('../../auth/services/usersService');
const logger = require('../../../utils/logger');
const Op = require('sequelize').Op;

let instance;

class EmployeesService {

    /**
     * сохранение работника и создание для него
     * резюме с определенными специализациями
     * @param user
     * @param profiles
     */
    addCvToEmployee(user, profiles) {
        return Employees.findOrCreate({
            where: {
                user_id: {
                    [Op.eq]: user.id
                }
            },
            defaults: {
                user_id: user.id
            }
        }).then((savedEmployee) => {
                Object.keys(profiles).forEach((value, index, array) => {
                    cvService.saveCv(value, profiles[value], savedEmployee[0].id)
                        .then((cv) => {
                            logger.log(cv);
                        })
                });
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