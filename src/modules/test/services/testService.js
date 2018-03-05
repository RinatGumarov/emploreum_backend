const models = require("../../../core/models");
const Tests = models.tests;
const PassedQuestions = models.passedQuestions;
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

    async findAllQuestionsByTestId(testId) {
        let questions = await models.questions.findAll({
            where: {
                testId: {
                    [Op.eq]: testId,
                }
            },
            attributes: ["id", "name", "type"],
            include: [{
                model: models.answers,
            }],
        });
        return questions;
    }

    async findQuestionById(id) {
        return await models.questions.findOne({
            include: {
                model: models.answers,
                attributes: ["id", "name"],
            },
            where: {
                id: {
                    [Op.eq]: id,
                }
            }
        });
    }

    async findPassedQuestions(testId) {
        return await PassedQuestions.findAll({
            where: {
                testId: {
                    [Op.eq]: testId,
                }
            },
        })
    }

    async saveQuestion(question) {
        return await models.questions.create(question)
    }

    async saveAnswer(answer) {
        return await models.answers.create(answer);
    }

    async savePassedQuestion(passedQuestion) {
        return await PassedQuestions.create(passedQuestion);
    }

    async getCorrectAnswers(questionId) {
        return await models.answers.findAll({
            where: {
                [Op.and]: {
                    questionId: {
                        [Op.eq]: questionId,
                    },
                    isTrue: {
                        [Op.eq]: true,
                    },
                }
            }
        })
    }

    async startTest(employee, test) {
        return await TestEnds.create({
            employeeId: employee.id,
            testId: test.id,
            ends: test.duration ? new Date().setMinutes(new Date().getMinutes() + test.duration) : null
        });
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

    async submitTest(employee, test){
        let testEnds = await this.findTestEnds(employee.id, test.id);
        testEnds.ends = new Date();
        return await testEnds.save();
    }

    async questionsAvailable(employee, test) {
        if (!test.duration)
            return true;
        let started = await this.findTestEnds(employee.id, test.id);
        return (started.ends === null || started.ends > new Date());
    }

    countValueOfQuestion(question, questions) {
        let sumOfDifficulties = questions.reduce((sum, current) => {
            return sum + (current.difficulty ? current.difficulty : 1)
        }, 0);
        return (question.difficulty || 1) / sumOfDifficulties;
    }

    countValueOfAnswer(isTrue, answers, correctAnswers, type) {
        if (type === 'input')
            return isTrue ? 1 : 0;
        return (isTrue ? 1 : -1) * (1 / (isTrue?correctAnswers.length : answers.length));
    }
}

if (typeof instance !== TestService) {
    instance = new TestService();
}

module.exports = instance;