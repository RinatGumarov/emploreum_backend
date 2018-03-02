const testService = require('../services/testService');
const testScoresService = require('../services/testScoresService');
const profileSkillService = require('../../specialisation/services/profileSkillService');
const vacancyService = require('../../company/services/vacancyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    router.post('/company/create', async (req, res) => {
        try {
            let company = req.user.company;
            let options = req.body;
            options.company_id = company.id;
            let test = await testService.save(options);
            let profiles = req.body.specifications;
            await profiles.forEach(async (profile) => {
                await profile.skills.forEach(async (skill) => {
                    let profileSkill = await profileSkillService.findProfileSkill(profile.id, skill.id);
                    await testService.addProfileSkills(test, profileSkill);
                });
            });

            return res.send(test.id);
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: err.message});
        }
    });

    router.post('/:id([0-9]+)/question/create', async (req, res) => {
        let question = {};
        question.name = req.body.question.name;
        question.type = req.body.question.type;
        question.test_id = req.params.id;
        question = await testService.saveQuestion(question);
        for (let answer of req.body.question.answers) {
            answer.is_true = answer.isTrue;
            delete answer.isTrue;
            answer.question_id = question.id;
            await testService.saveAnswer(answer);
        }
        res.send({data: 'success'});
    });

    router.get('/:id([0-9]+)/', async (req, res) => {
        let vacancy = await vacancyService.findById(req.params.id);
        let company = req.user.company;
        let test = await testService.findById(vacancy.test_id);
        if (company && test && test.company_id === company.id) {
            res.send(test);
        } else {
            if (test.questions) {
                let passedQuestions = await testService.findPassedQuestions(test.id);
                let passedQuestionsIds;
                if (passedQuestions)
                    passedQuestionsIds = await passedQuestions.map((pq) => {
                        return pq.question_id;
                    });
                test.questions = await test.questions.map((q) => {
                    if (!passedQuestions)
                        q.dataValues.viewed = passedQuestionsIds.indexOf(q.id) > -1;
                    else
                        q.dataValues.viewed = false;
                    return q;
                });
                await test.questions.forEach((question) => {
                    delete question.answers;
                    delete question.name;
                });
            }
            res.send(test);
        }
    });

    router.get('/vacancy/:id([0-9]+)/', async (req, res) => {
        let vacancy = await vacancyService.findById(req.params.id);
        let test = await testService.findByIdForEmployee(vacancy.test_id);
        if (test.questions) {
            let passedQuestions = await testService.findPassedQuestions(test.id);
            let passedQuestionsIds;
            if (passedQuestions)
                passedQuestionsIds = await passedQuestions.map((pq) => {
                    return pq.question_id;
                });
            test.questions = await test.questions.map((q) => {
                q.dataValues.viewed = passedQuestionsIds.indexOf(q.id) > -1;
                return q;
            });
            res.send(test);
        }
    });

    router.get('/:id([0-9]+)/questions', async (req, res) => {
        let questions = await testService.findAllQuestionsByTestId(req.params.id);
        return res.send(questions);
    });

    router.get('/question/:id([0-9]+)', async (req, res) => {
        let question = await testService.findQuestionById(req.params.id);
        if (question.type === 'input')
            for (let answer of question.dataValues.answers) {
                delete answer.dataValues.name;
            }
        return res.send(question);
    });


    /**
     * начало теста
     */
    router.get('/:id([0-9]+)/start', async (req, res) => {
        try {
            let employee = req.user.employee;
            let vacancy = await vacancyService.findById(req.params.id);
            let test = await testService.findById(vacancy.test_id);
            if (!employee || testService.alreadyStarted(employee, test))
                return res.status(405).send({error: "Not Allowed"});
            await testService.startTest(employee, test);
            return res.send({data: success});
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: err.message});
        }
    });

    /**
     * получить ответ и проверить его правильность
     */
    router.post('/question/:questionId([0-9]+)/answer', async (req, res) => {
        let answers = req.body.answers;
        let employee = req.user.employee;
        let correctAnswers = await testService.getCorrectAnswers(req.params.questionId);
        let question = await testService.findQuestionById(req.params.questionId);
        let result;
        switch (question.type) {
            case 'multipleChoice' :
                for (let correct of correctAnswers) {
                    if (answers.indexOf(correct) === -1) {
                        result = false;
                        break;
                    }
                }
                break;
            case 'input':
                if (!correctAnswers || correctAnswers[0] === answers[0])
                    result = false;
                break;
        }
        await testScoresService.save(question.test_id, employee, result);
        return res.send({data: 'success'});
    });

    return router;

};
