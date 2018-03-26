const questionService = require("../services/questionService");
const answerService = require("../services/answerService");
const testService = require('../services/testService');
const testScoresService = require('../services/testScoresService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /**
     * получить ответ и проверить его правильность
     */
    router.post('/question/:questionId([0-9]+)/answer', async (req, res) => {
        try {
            
            let answers = req.body;
            let employee = req.user.employee;
            let correctAnswers = (await answerService.getCorrectAnswers(req.params.questionId))
                .map((answer) => answer.name);
            let question = await questionService.findQuestionById(req.params.questionId);
            let test = await testService.findById(question.testId);
            if (!(await questionService.questionsAvailable(employee, test))) {
                return res.status(405).json({error: 'Not Allowed'});
            }
            for (let passed of answers) {
                let correct = correctAnswers.indexOf(passed) !== -1;
                let passedQuestion = {
                    employeeId: employee.id,
                    testId: test.id,
                    questionId: question.id,
                    answer: passed,
                    correct,
                    value: (await questionService.countValueOfQuestion(question, test.questions))
                    * (await answerService.countValueOfAnswer(correct, question.answers, correctAnswers, question.type))
                };
                await questionService.savePassedQuestion(passedQuestion);
            }
            await testScoresService.saveOrUpdate(question.testId, employee);
            return res.json({data: 'success'});
            
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).json({error: err.message});
        }
    });
    
    return router;
    
};