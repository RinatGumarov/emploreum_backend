const skillService = require('../../specialisation/services/skillService');
const profilesService = require('../../specialisation/services/profileService');
const employeeService = require('../services/employeeService');
const companyService = require('../../company/services/companyService');
const workService = require('../services/workService');
const vacancyService = require('../../company/services/vacancyService');
const Account = require('../../blockchain/utils/account');
const logger = require('../../../utils/logger');
const Web3InitError = require('../../blockchain/utils/Web3Error');
const work = require('../../blockchain/utils/work');

module.exports.func = (router) => {

    router.post('/vacancy/:vacancyId/add', async (req, res) => {
        try {
            let vacancyId = req.params.vacancyId;
            let vacancy = await vacancyService.findById(vacancyId);
            let employee = await employeeService.getByUserId(req.user.id);
            let company = await companyService.findByUserIdWithUser(req.body.companyId);
            await employeeService.attachVacancy(employee, vacancyId);
            if (!(await employeeService.wasWorking(employee.id))) {
                let blockchainEmployee = {
                    firstName: employee.name,
                    lastName: employee.name,
                    email: req.user.email,
                    raiting: 10,
                    address: req.user.account_address,
                    positionCodes: [],
                    skillCodes: [],
                    skillToPosition: [],
                };
                await Account.registerEmployee(blockchainEmployee).then(result => {
                    if (!result)
                        throw new Web3InitError('Could not registrate employee in blockchain');
                });
            }
            if (!(await companyService.hasContracts(company.id))) {
                let blockchainCompany = {
                    name: company.name,
                    raiting: 10,
                    address: company.user.account_address,
                };
                await Account.registerCompany(blockchainCompany).then(result => {
                    if (!result)
                        throw new Web3InitError('Could not registrate company in blockchain');
                });

            }
            let today = Math.round(Date.now() / 1000) + 20000;
            let workData = {
                vacancy_id: vacancyId,
                begin_date: today,
                end_date: 1519827609,
                employee_id: employee.id,
                company_id: company.id,
                status: 0,
            };
            let workBlockchain = {
                skillCodes: [],
                skillToPosition: [],
                startDate: today,
                endDate: workData.end_date,
                empoloyee: req.user.account_address,
                company: company.user.account_address,
                weekPayment: vacancy.pricePerWeek,
            };
            await work.createWork(workBlockchain).then(result => {
                if (!result)
                    throw new Web3InitError('Could not registrate company in blockchain');
            });
            workService.save(workData, employee);
            return res.send({data: 'success'});
        }
        catch (err) {
            logger.error(err.message);
            return res.status(500).send({error: 'Could not attach vacancy'});
        }
    });

    router.get('/vacancy/recommended', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        let employeeSkills = await skillService.getEmployeeSkills(employee.id);
        let recommendedVacancies = await vacancyService.getRecommended(employeeSkills, employee.id);
        res.json(recommendedVacancies);
    });

    router.get('/info', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        res.json(employee);
    });

    // toDo переделать на профили - скилы
    router.get('/skills', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        let employeeSkills = await skillService.getEmployeeSkills(employee.id);
        res.json(employeeSkills);
    });

    router.get('/address', async (req, res) => {
        return res.send(req.user.account_address);
    });

    router.get('/contracts/current', async (req, res) => {
       try {
           let employee = await employeeService.getByUserId(req.user.id);
           return res.send(await workService.findAllByEmployeeId(employee.id));
       }
       catch (err) {
           logger.error(err.trace);
           return res.status(500).send({error: 'Could not get current works for the employee'});
       }
    });

    router.get('/profiles', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        let employeeProfiles = await profilesService.getEmployeeProfiles(employee.id);
        res.json(employeeProfiles);
    });

    return router;
};