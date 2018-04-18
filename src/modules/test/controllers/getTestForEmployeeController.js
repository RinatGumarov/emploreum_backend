const testService = require('../services/testService');
const questionService = require('../services/questionService');
const vacancyService = require('../../vacancy/services/vacancyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /** запрашивание теста работником по вакансии */
    router.get('/vacancy/:vacancyId([0-9]+)', async (req, res) => {
        try {
            let vacancy = await vacancyService.findById(req.params.vacancyId);
            let test = await testService.findByIdForEmployee(vacancy.testId);
            
            if (test.questions) {
            
                let passedQuestions = await questionService.findPassedQuestions(req.user.employee, test);
                let passedQuestionsIds;
                if (passedQuestions)
                    passedQuestionsIds = await passedQuestions.map((pq) => {
                        return pq.questionId;
                    });
                test.questions = await test.questions.map((q) => {
                    q.dataValues.viewed = passedQuestionsIds.indexOf(q.id) > -1;
                    return q;
                });
                res.json(test);
            
            }
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err.message});
        }
    });
    
    return router;
    
};
