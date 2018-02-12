module.exports = function (req, res, next) {
    res.header('Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin,' +
        ' Access-Control-Allow-Headers,' +
        ' Content-Type,' +
        ' Access-Control-Allow-Credentials, ' +
        ' Access-Control-Expose-Headers, ' +
        ' X-Requested-With, ' +
        ' Authorization');
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
    res.header('Access-Control-Allow-Credentials', "true");
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
    if ('OPTIONS' === req.method) {
        res.send();
    }
    else {
        next();
    }
};