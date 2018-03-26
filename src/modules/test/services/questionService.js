const models = require("../../../core/models");
const Op = models.sequelize.Op;

const PassedQuestions = models.passedQuestions;
const Questions = models.questions;

const testService = require("./testService");

let instance;

class QuestionService {
    
    async findQuestionById(id) {
        return await Questions.findOne({
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
    
    async findPassedQuestions(employee, test) {
        return await PassedQuestions.findAll({
            where: {
                [Op.and]: {
                    testId: {
                        [Op.eq]: test.id,
                    },
                    employeeId: {
                        [Op.eq]: employee.id
                    }
                }
            },
        })
    }
    
    async findAllQuestionsByTestId(testId) {
        let questions = await Questions.findAll({
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
    
    
    async saveQuestion(question) {
        return await Questions.create(question)
    }
    
    async savePassedQuestion(passedQuestion) {
        return await PassedQuestions.create(passedQuestion);
    }
    
    async questionsAvailable(employee, test) {
        if (!test.duration)
            return true;
        let started = await testService.findTestEnds(employee.id, test.id);
        if (!started)
            return false;
        return (started.ends === null || started.ends > new Date());
    }
    
    async countValueOfQuestion(question, questions) {
        let sumOfDifficulties = questions.reduce((sum, current) => {
            return sum + (current.difficulty ? current.difficulty : 1)
        }, 0);
        return (question.difficulty || 1) / sumOfDifficulties;
    }
    
}
instance = new QuestionService();
module.exports = instance;