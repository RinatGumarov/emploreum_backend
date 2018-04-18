const vacancyService = require('../services/vacancyService');

module.exports.func = (router) => {
    
    router.post('/:id([0-9]+)/invite', async (req, res) => {
        let vacancy = await vacancyService.findById(req.params.id);
        if (await vacancyService.sendInvitationToEmployee(req.user.company, vacancy, req.body.employeeId))
            return res.json({data: 'success'});
        return res.status(405).json({error: 'You are not provided to invite employee to another\'s vacancy'});
        
    });
    
    return router;
};
