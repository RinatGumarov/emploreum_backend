const logger = require('../../../utils/logger');

const status = require('../utils/status');

module.exports.func = (router) => {
    
    /** пропустить шаг */
    router.get('/signup/skip', async (req, res) => {
        try {
            await status.incrementStatusAndReturnResponse(req.user);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err.message});
        }
    });
    
    
    return router;
    
};
