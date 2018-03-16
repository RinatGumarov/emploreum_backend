const testService = require('../services/testService');
const testScoresService = require('../services/testScoresService');
const profileSkillService = require('../../specialisation/services/profileSkillService');
const vacancyService = require('../../company/services/vacancyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /**
     * создание теста компанией
     *
     */
    router.post('/company/create', async (req, res) => {
        try {
            let company = req.user.company;
            let options = req.body;
            options.companyId = company.id;
            let test = await testService.save(options);
            let profiles = req.body.specifications;
            await profiles.forEach(async (profile) => {
                await profile.skills.forEach(async (skill) => {
                    let profileSkill = await profileSkillService.findProfileSkill(profile.id, skill.id);
                    await testService.addProfileSkills(test, profileSkill);
                });
            });
            
            return res.json(test.id);
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).json({error: err.message});
        }
    });
    
    /**
     * создение вопроса компанией
     */
    router.post('/:id([0-9]+)/question/create', async (req, res) => {
        try {
            let question = {};
            question.name = req.body.question.name;
            question.type = req.body.question.type;
            question.difficulty = req.body.difficulty;
            question.testId = req.params.id;
            question = await testService.saveQuestion(question);
            for (let answer of req.body.question.answers) {
                answer.questionId = question.id;
                await testService.saveAnswer(answer);
            }
            res.json({data: 'success'});
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err.message});
        }
    });
    
    /**
     * запрашивание теста компанией
     */
    router.get('/:testId([0-9]+)', async (req, res) => {
        try {
            let company = req.user.company;
            let test = await testService.findById(req.params.testId);
            if (company && test && test.companyId === company.id) {
                return res.json(test);
            }
            res.status(500).json({error: "access deny"});
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err.message});
        }
    });
    
    /**
     * запрашивание теста работником по вакансии
     */
    router.get('/vacancy/:id([0-9]+)', async (req, res) => {
        try {
            let vacancy = await vacancyService.findById(req.params.id);
            let test = await testService.findByIdForEmployee(vacancy.testId);
            if (test.questions) {
                let passedQuestions = await testService.findPassedQuestions(req.user.employee, test);
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
    
    /**
     * запрашивание
     */
    router.get('/:id([0-9]+)/questions', async (req, res) => {
        let questions = await testService.findAllQuestionsByTestId(req.params.id);
        let test = await testService.findById(req.params.id);
        return res.json(questions);
    });
    
    router.get('/question/:id([0-9]+)', async (req, res) => {
        let employee = req.user.employee;
        let question = await testService.findQuestionById(req.params.id);
        let test = await testService.findById(question.testId);
        let passed = await testService.findTestEnds(employee.id, question.testId);
        if (!(await testService.questionsAvailable(employee, test))) {
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
    
    
    /**
     * начало теста, find по вакансии
     */
    router.get('/:vacancyId([0-9]+)/start', async (req, res) => {
        try {
            let employee = req.user.employee;
            let vacancy = await vacancyService.findById(req.params.vacancyId);
            let test = await testService.findById(vacancy.testId);
            let started = await  testService.findTestEnds(employee.id, test.id);
            if (started) {
                return res.json({data: 'already started'});
            }
            if (!started)
                await testService.startTest(employee, test);
            return res.json({data: 'success'});
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).json({error: err.message});
        }
    });
    
    /**
     * получить ответ и проверить его правильность
     */
    router.post('/question/:questionId([0-9]+)/answer', async (req, res) => {
        let answers = req.body;
        let employee = req.user.employee;
        let correctAnswers = (await testService.getCorrectAnswers(req.params.questionId))
            .map((answer) => answer.name);
        let question = await testService.findQuestionById(req.params.questionId);
        let test = await testService.findById(question.testId);
        if (!(await testService.questionsAvailable(employee, test))) {
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
                value: (await testService.countValueOfQuestion(question, test.questions))
                * (await testService.countValueOfAnswer(correct, question.answers, correctAnswers, question.type))
            };
            await testService.savePassedQuestion(passedQuestion);
        }
        await testScoresService.saveOrUpdate(question.testId, employee);
        return res.json({data: 'success'});
    });
    
    /**
     * vacancyId
     */
    router.get('/:vacancyId([0-9]+)/submit', async (req, res) => {
        let employee = req.user.employee;
        let vacancy = await vacancyService.findById(req.params.vacancyId);
        let test = await testService.findById(vacancy.testId);
        await testService.submitTest(employee, test);
        res.json({data: 'success'});
    });
    
    return router;
    
};
