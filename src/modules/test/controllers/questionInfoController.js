const questionService = require("../services/questionService");
const testService = require('../services/testService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /**
     * запрашивание вопроса
     */
    router.get('/question/:questionId([0-9]+)', async (req, res) => {
        
        let employee = req.user.employee;
        let question = await questionService.findQuestionById(req.params.questionId);
        let test = await testService.findById(question.testId);
        let passed = await testService.findTestEnds(employee.id, question.testId);
        
        if (!(await questionService.questionsAvailable(employee, test))) {
            if (passed)
                logger.error(passed.ends);
            return res.status(405).json({error: 'Not Allowed'});
        }
        if (question.type === 'input')
            for (let answer of question.dataValues.answers) {
                delete answer.dataValues.name;
            }
        
        return res.json(question);
    });
    
    return router;
};