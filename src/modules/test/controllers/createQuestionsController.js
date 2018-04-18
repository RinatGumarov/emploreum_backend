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
    
    return router;
};