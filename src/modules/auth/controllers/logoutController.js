const passport = require('passport');

module.exports.func = (router) => {
    
    router.get('/logout', async (req, res) => {
        req.session.destroy();
        res.json('success');
    });
    
    
    return router;
    
};
