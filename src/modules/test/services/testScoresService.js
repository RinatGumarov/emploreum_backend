const models = require("../../../core/models");
const Op = models.sequelize.Op;
const logger = require('../../../utils/logger');
const _ = require('lodash');

let instance;

class TestScoresService {

    async save(testId, employee, correct) {
        let testScore = await models.test_scores.findOrBuild({
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
            defaults: {
                employee_id: employee.id,
                test_id: testId,
            },
        });
        testScore.questions_count += 1;
        if (correct)
            testScore.questions_count += 1;
        return await testScore.save();
    }

}

instance = new TestScoresService();

module.exports = instance;