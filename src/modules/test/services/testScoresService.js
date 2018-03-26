const models = require("../../../core/models");

const TestScores = models.testScores;
const PassedQuestions = models.passedQuestions;

const Op = models.sequelize.Op;
const _ = require('lodash');

let instance;

class TestScoresService {

    async saveOrUpdate(testId, employee) {
        let testScore;
        testScore = await TestScores.findOne({
            where: {
                [Op.and]: {
                    employeeId: {
                        [Op.eq]: employee.id,
                    },
                    testId: {
                        [Op.eq]: testId,
                    }
                }
            },
        });
        if (!testScore)
            testScore = await TestScores.build({
                employeeId: employee.id,
                testId: testId,
            });
        testScore.passed = (await this.findEmployeeTestAnswers(employee, testId))
            .reduce((acc, cur) => {
                return acc += cur.value;
            }, 0) / 1 > 0.8;

        return await testScore.save();
    }

    async findEmployeeTestAnswers(employee, testId) {
        return await PassedQuestions.findAll({
            where: {
                [Op.and]: {
                    testId: {
                        [Op.eq]: testId,
                    },
                    employeeId: {
                        [Op.eq]: employee.id,
                    }
                },
            }
        });
    }

}

instance = new TestScoresService();

module.exports = instance;