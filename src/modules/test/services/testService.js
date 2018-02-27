const models = require("../../../core/models");
const Tests = models.tests;
const Op = models.sequelize.Op;
const logger = require('../../../utils/logger');
const _ = require('lodash');

let instance;

class TestService {

    async save(options) {
        return await Tests.create(options);
    }

    async addProfileSkills(test, profileSkills) {
        return await test.addProfile_skills(profileSkills);
    }

    async findById(id) {
        let test = await Tests.findById(id, {
            include: [{
                model: models.questions,
                include: [{
                    model: models.answers,
                }]
            }, {
                model: models.profile_skills,
                attributes: ["profile_id"],
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
        _.uniqBy(test.dataValues.profile_skills, "profile_id")
            .map((specification) => {
                test.dataValues.specifications.push(specification.profile);
            });
        delete test.dataValues.profile_skills;
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
                test_id: {
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
        return await models.passed_questions.findAll({
            where: {
                test_id: {
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
        return await models.passed_tests.create();
    }

    async getCorrectAnswers(questionId) {
        return await models.answers.findAll({
            where: {
                [Op.and]: {
                    question_id: {
                        [Op.eq]: questionId,
                    },
                    is_true: {
                        [Op.eq]: true,
                    },
                }
            }
        })
    }
}

if (typeof instance !== TestService) {
    instance = new TestService();
}

module.exports = instance;