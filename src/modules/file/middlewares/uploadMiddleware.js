const authMiddleware = require('../../auth/middlewares/authMiddleware');
const uploadIniter = require('../util/uploadIniter');


module.exports.func = (router) => {

    router.post('/upload', uploadIniter.getMiddleware().single('file'), function (req, res, next) {
        res.send(req.file.filename);
    });

    return router;
};


