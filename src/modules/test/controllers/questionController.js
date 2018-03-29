const questionService = require("../services/questionService");
const answerService = require("../services/answerService");
const testService = require('../services/testService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /**
     * создение вопроса компанией
     */
    router.post('/:testId([0-9]+)/question/create', async (req, res) => {
        try {
            
            let question = {};
            question.name = req.body.question.name;
            question.type = req.body.question.type;
            question.difficulty = req.body.difficulty;
            question.testId = req.params.testId;
            
            question = await questionService.saveQuestion(question);
            
            for (let answer of req.body.question.answers) {
                answer.questionId = question.id;
                await answerService.saveAnswer(answer);
            }

            res.json(question);
        } catch (err) {
            
            logger.error(err.stack);
            res.status(500).json({error: err.message});
            
        }
    });
    
    /**
     * запрашивание вопросов
     */
    router.get('/:testId([0-9]+)/questions', async (req, res) => {
        let questions = await questionService.findAllQuestionsByTestId(req.params.testId);
        return res.json(questions);
    });
    
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