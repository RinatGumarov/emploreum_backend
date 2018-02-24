const testService = require('../services/testService');
const profileService = require('../../specialisation/services/profileService');
const companyService = require('../../company/services/companyService');

module.exports.func = (router) => {

    router.post('/company/create', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.user.id);
            let options = req.body;
            options.company_id = company.id;
            let test = await testService.save(options);
            let profiles = req.body.specifications;
            await profiles.forEach(async (profile) => {
                await profile.skills.forEach(async (skill) => {
                    let profileSkill = await profileService.findProfileSkill(profile.id, skill.id);
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
        for (let answer of req.body.question.answers){
            answer.is_true = answer.isTrue;
            delete answer.isTrue;
            answer.question_id = question.id;
            await testService.saveAnswer(answer);
        }
        res.send({data: 'success'});
    });

    router.get('/:id([0-9]+)/', async (req, res) => {
        let company = await companyService.findByUserId(req.user.id);
        let test = await testService.findById(req.params.id);
        if (test.company_id === company.id){
            res.send(test);
        } else {
            if (test.questions)
            await test.questions.forEach((question) => {
                delete question.answers;
                delete question.name;
            });
            res.send(test);
        }
    });

    router.get('/:id([0-9]+)/questions', async (req, res) => {
        let company = await companyService.findByUserId(req.user.id);
        let questions = await testService.findAllQuestionsByTestId(req.params.id);
        return res.send(questions);
    });

    return router;

};

