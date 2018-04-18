const workService = require('../services/workService');

module.exports.func = (router) => {
    
    router.post('/:workId([0-9]+)/start', async (req, res) => {
        await workService.startWork(req.params.workId);
        res.json({data: 'successful'});
    });
    
    return router;
    
};

