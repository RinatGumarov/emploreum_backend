module.exports.func = (router) => {

    router.get('/', (req, res, next) => {
        console.log(1);
        next();
    });

    return router;
};

