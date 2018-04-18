const employeeService = require('../../employee/services/employeeService');
const companyService = require('../../company/services/companyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/enroll/:vacancyId([0-9]+)', async (req, res) => {
        try {
            let vacancyId = req.params.vacancyId;
            let company = await companyService.findByVacancyId(vacancyId);
            await employeeService.attachVacancy(req.user.employee, vacancyId);
            return res.send({data: 'success'});
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500)
                .send({error: 'Could not attach vacancy'});
        }
    });
    
    return router;
};
