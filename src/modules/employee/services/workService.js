const models = require('../../../core/models');
const Works = models.works;
const logger = require('../../../utils/logger');

const Op = models.sequelize.Op;

let instance;

class WorkService {

    async save(workData, employee) {
        return await Works.build(workData).save();
    }

    async findAllByEmployeeId(employeeId) {
        let works = await Works.findAll({
                                       where: {
                                           employee_id: {
                                               [Op.eq]: employeeId
                                           }
                                       }
                                   });
        return works;
    }

}

if (typeof instance !== WorkService) {
    instance = new WorkService();
}

module.exports = instance;