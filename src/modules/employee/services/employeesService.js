const models = require('../../../core/models');
const Employees = models.employees;
const cvService = require('./cvsService');
const logger = require('../../../utils/logger');

let instance;

class EmployeesService {

    /**
     * сохранение работника и создание для него
     * резюме с определенными специализациями
     * @param user
     * @param profiles
     */
    addCvToEmployee(user, profiles) {
        Employees.findOrCreate({
            where:{
                user_id: user.id
            },
            defaults: {
                user_id: user.id
            }
        }).then((savedEmployee) => {
                logger.log(savedEmployee[0]);
                Object.keys(profiles).forEach((value, index, array) => {
                    cvService.saveCv(value, profiles[value],savedEmployee[0].id)
                        .then((cv) => {
                            logger.log(cv);
                        })
                });
            }
        );
    }


}

if (typeof instance !== EmployeesService) {
    instance = new EmployeesService();
}

module.exports = instance;