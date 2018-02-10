const companyService = require('../services/companyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    /**
     *  получить компанию, зная сессию.
     */
    router.get('/account', (req, res) => {
        res.json({success: "success"})
    });


    return router;

};