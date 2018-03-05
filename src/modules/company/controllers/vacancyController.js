const companyService = require('../services/companyService');
const vacancyService = require('../services/vacancyService');
const profileSkillService = require('../../specialisation/services/profileSkillService');
const employeeService = require('../../employee/services/employeeService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {

    router.post('/vacancy/create', async (req, res) => {
        try {
            let company = req.user.company;
            let options = req.body;
            options.test_id = options.testId;
            options.week_payment = options.weekPayment;
            options.company_id = company.id;
            let vacancy = await vacancyService.save(options);
            let profiles = options.specifications;
            await profiles.forEach(async (profile) => {
                await profile.skills.forEach(async (skill) => {
                    let profileSkill = await profileSkillService.findProfileSkill(profile.id, skill.id);
                    let vacancyProfileSkill = await vacancyService.addProfileSkillToVacancy({
                        vacancy_id: vacancy.id,
                        profile_skill_id: profileSkill.id
                    });
                    logger.log(vacancyProfileSkill);
                });
            });
            return res.status(200).send({vacancy: vacancy});
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: err.message});
        }
    });

    /**
     * получить все вакансии по компании
     */
    router.get('/vacancy', async (req, res) => {
        try {
            let company = req.user.company;
            let vacancies = await vacancyService.findAllVacanciesByCompany(company);
            res.send(vacancies);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: err.message});
        }
    });

    /**
     * получить инфомарцию о вакансии
     */
    router.get('/vacancy/info/:id([0-9]+)', async (req, res) => {
        try {
            let vacancy = await vacancyService.findById(req.params.id);
            if (req.user.role === "EMPLOYEE") {
                let available = await vacancyService.isAvailable(req.params.id, req.user.id);
                vacancy.setDataValue("available", available);
            }
            res.send(vacancy);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: err.message});
        }
    });

    router.get('/vacancy/:id([0-9]+)/specification', async (req, res) => {
        try {
            let skills = await vacancyService.getVacancyProfiles(req.params.id);
            res.send(skills);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: err.message});
        }
    });


    router.get('/vacancy/:id([0-9]+)/candidates', async (req, res) => {
        try {
            let candidates = await vacancyService.getCandidatesByVacancyId(req.params.id);
            res.send(candidates);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: err.message});
        }
    });

    /**
     * отклонить постучавшегося кандидата
     */
    router.post('/vacancy/:vacancyId([0-9]+)/candidate/:candidatesId([0-9]+)/reject', async (req, res) => {
        try {
            await vacancyService.deleteAwaitedContractByVacancyId(req.params.vacancyId, req.params.candidatesId);
            res.send({data: "success"});
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: err.message});
        }
    });

    /**
     * Только для работника. Узнать может ли он постучаться на вакансию.
     */
    router.get('/vacancy/:vacancyId([0-9]+)/available', async (req, res) => {
        try {
            let isAvailable = await vacancyService.isAvailable(req.params.vacancyId, req.user.id);
            res.send(isAvailable);
        } catch (err) {
            logger.error(err.stack);
            res.send({error: err.message});
        }
    });


    router.post('/vacancy/:id([0-9]+)/invite', async (req, res) => {
        let vacancy = await vacancyService.findById(req.params.id);
        if (await vacancyService.sendInvitationToEmployee(req.user.company, vacancy, req.body.employeeId))
            return res.send({data: 'success'});
        return res.status(405).send({error: 'You are not provided to invite employee to another\'s vacancy'});

    });

    return router;

};
