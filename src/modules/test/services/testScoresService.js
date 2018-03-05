const models = require("../../../core/models");
const Op = models.sequelize.Op;
const logger = require('../../../utils/logger');
const _ = require('lodash');

let instance;

class TestScoresService {

    async saveOrUpdate(testId, employee) {
        let testScore;
        testScore = await models.test_scores.findOne({
            where: {
                [Op.and]: {
                    employee_id: {
                        [Op.eq]: employee.id,
                    },
                    test_id: {
                        [Op.eq]: testId,
                    }
                }
            },
        });
        if (!testScore)
            testScore = await models.test_scores.build({
                employee_id: employee.id,
                test_id: testId,
            });
        testScore.passed = (await this.findEmployeeTestAnswers(employee, testId))
            .reduce((acc, cur) => {
                return acc += 1
            }, 0);

        return await testScore.save();
    }

    async findEmployeeTestAnswers(employee, testId) {
        return await models.passed_questions.findAll({
            where: {
                [Op.and]: {
                    test_id: {
                        [Op.eq]: testId,
                    },
                    employee_id: {
                        [Op.eq]: employee.id,
                    }
                },
            }
        });
    }

}

instance = new TestScoresService();

module.exports = instance;