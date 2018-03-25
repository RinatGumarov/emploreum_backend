const cvService = require('../services/cvService');
const employeeService = require('../services/employeeService');
const workService = require('../../blockchain/services/workService');
const userService = require('../../user/services/userService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    router.get('/info/:employeeUserId([0-9]+)', async (req, res) => {
        try {
            let employee = await employeeService.getByUserId(req.params.employeeUserId);
            return res.json(employee);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: 'Could not get info by employee'});
        }
    });

    /**
     * обновить инфу по aut employee
     */
    router.post('/info/update', async (req, res) => {
        try {
            await employeeService.update(req.user.employee, req.body);
            await userService.addLanguages(req.user, req.body.languages);
            res.json("success");
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: 'Could not update info by auth employee'});
        }
    });
    
    
    router.get('/skills/:employeeUserId([0-9]+)', async (req, res) => {
        try {
            let employeeSkills = await cvService.getEmployeeSpecification(req.params.employeeUserId);
            res.json(employeeSkills);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: 'Could not get skills by employee'});
        }
    });
    
    /**
     * получить все скилы по аунтифицированому employee
     */
    router.get('/skills', async (req, res) => {
        try {
            let employeeSkills = await cvService.getEmployeeSpecification(req.user.employee.id);
            res.json(employeeSkills);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: 'Could not get skills by auth employee'});
        }
    });
    
    router.post('/skills/update', async (req, res) => {
        try {
            let profiles = req.body;
            for (let i = 0; i < profiles.length; i++) {
                let cv = await cvService.save(profiles[i], req.user.employee);
                for (let j = 0; j < profiles[i].skills.length; j++) {
                    await cvService.addSkill(cv, profiles[i].skills[j])
                }
            }
            res.json("success");
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: 'Could update specifications by auth employee'});
        }
    });
    
    router.get('/contracts/awaited', async (req, res) => {
        try {
            let contracts = await employeeService.getAwaitedContracts(req.user.employee);
            return res.send(contracts);
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: 'Could not get awaited contracts for the employee'});
        }
    });
    
    router.get('/contracts/current', async (req, res) => {
        try {
            return res.send(await workService.findAllByEmployeeId(req.user.employee.id));
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: 'Could not get current works for the employee'});
        }
    });
    
    
    return router;
};
