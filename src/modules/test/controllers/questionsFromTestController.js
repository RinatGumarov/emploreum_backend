const questionService = require("../services/questionService");

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /**
     * запрашивание вопросов
     */
    router.get('/:testId([0-9]+)/questions', async (req, res) => {
        let questions = await questionService.findAllQuestionsByTestId(req.params.testId);
        return res.json(questions);
    });
    
    return router;
};