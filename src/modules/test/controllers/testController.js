const testService = require('../services/testService');
const questionService = require('../services/questionService');
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
     * Засабмитеть тест работником
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
