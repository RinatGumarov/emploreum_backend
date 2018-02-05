const models = require('../../../core/models');
const Employees = models.employees;
const cvService = require('./cvService');

let instance;

class EmployeesService {

    /**
     * сохранение работника и его профилей
     * @param user
     * @param profiles
     */
    saveEmploye(user, profiles) {
        Employees.build({
            user_id: user.id
        })
            .save().then((savedEmployee) => {
                logger.log(savedEmployee);
                Object.keys(profiles).forEach((value, index, array) => {
                    cvService.saveCv(value, savedEmployee.id)
                });
            }
        );
    }


}

if (typeof instance !== EmployeesService) {
    instance = new EmployeesService();
}

module.exports = instance;