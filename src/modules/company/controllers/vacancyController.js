const companyService = require('../services/companyService');
const vacancyService = require('../services/vacancyService');
const employeeService = require('../../employee/services/employeeService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {
    
    router.post('/vacancy/create', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.user.id);
            let options = req.body;
            options.week_payment = options.weekPayment;
            options.company_id = company.id;
            let vacancy = await vacancyService.save(options);
            let profiles = options.specifications;
            await profiles.forEach(async (profile) => {
                await profile.skills.forEach(async (skill) => {
                    let profileSkill = await vacancyService.findProfileSkill(profile.id, skill.id);
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
            let company = await companyService.findByUserId(req.user.id);
            let vacancies = await vacancyService.findAll(company.id);
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

    /**
     * Только для работника
     */
    router.get('/vacancy/available', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        res.send(await vacancyService.isAvailable(req.query.vacancyId, employee.id));
    });
    
    
    return router;
    
};