const authMiddleware = require('../../auth/middlewares/authMiddleware');
const uploadIniter = require('../util/uploadIniter');


module.exports.func = (router) => {

    router.post('/upload', uploadIniter.getMiddleware().single('file'), function (req, res, next) {
        try {
            res.json('/upload/' + req.file.filename);
        } catch (err) {
            res.status(500).send({error: "Could not save file"})
        }
    });

    return router;
};


