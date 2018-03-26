const models = require("../../../core/models");

const Op = models.sequelize.Op;

const Answers = models.answers;

let instance;

class AnswerService {
    
    
    async saveAnswer(answer) {
        return await Answers.create(answer);
    }
    
    async getCorrectAnswers(questionId) {
        let answers = await Answers.findAll({
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
        });
        return answers;
    }
    
    countValueOfAnswer(isTrue, answers, correctAnswers, type) {
        if (type === 'input')
            return isTrue ? 1 : 0;
        return (isTrue ? 1 : -1) * (1 / (isTrue ? correctAnswers.length : answers.length));
    }
}


instance = new AnswerService();
module.exports = instance;