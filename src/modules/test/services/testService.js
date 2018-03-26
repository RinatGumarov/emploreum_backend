const models = require("../../../core/models");
const Tests = models.tests;
const TestEnds = models.testEnds;

const Op = models.sequelize.Op;
const logger = require('../../../utils/logger');
const _ = require('lodash');

let instance;

class TestService {

    async save(options) {
        return await Tests.create(options);
    }

    async addProfileSkills(test, profileSkills) {
        return await test.addProfileSkills(profileSkills);
    }

    async findById(id) {
        let test = await Tests.findById(id, {
            include: [{
                model: models.questions,
                include: [{
                    model: models.answers,
                }]
            }, {
                model: models.profileSkills,
                attributes: ["profileId"],
                include: [{
                    model: models.profiles,
                    attributes: ["id", "name"],
                    include: [{
                        model: models.skills,
                        attributes: ["id", "name"],
                        through: {
                            attributes: []
                        },
                    }],
                }],
            }]
        });

        if (!test)
            return test;
        test.dataValues.specifications = [];
        _.uniqBy(test.dataValues.profileSkills, "profileId")
            .map((specification) => {
                test.dataValues.specifications.push(specification.profile);
            });
        delete test.dataValues.profileSkills;
        return test;
    }

    async findByIdForEmployee(id) {
        let test = await Tests.findById(id, {
            include: [{
                attributes: ["id"],
                model: models.questions,
            }]
        });
        return test;
    }

    async startTest(employee, test) {
        let ends = new Date();
        logger.log(ends);
        if (test.duration)
            ends.setMinutes(ends.getMinutes() + test.duration);
        logger.log(ends);
        let testEnds = await TestEnds.create({
            employeeId: employee.id,
            testId: test.id,
            ends: ends
        });
        return testEnds;
    }

    async alreadyStarted(employee, test) {
        let started = await this.findTestEnds(employee.id, test.id);
        // тест существует, у теста есть конечный срок, срок уже прошел
        return started;
    }

    async findTestEnds(employeeId, testId) {
        return await TestEnds.findOne({
            where: {
                [Op.and]: {
                    employeeId: {
                        [Op.eq]: employeeId,
                    },
                    testId: {
                        [Op.eq]: testId,
                    }
                }
            }
        });
    }

    async submitTest(employee, test) {
        let testEnds = await this.findTestEnds(employee.id, test.id);
        testEnds.ends = new Date();
        return await testEnds.save();
    }
}

instance = new TestService();
module.exports = instance;