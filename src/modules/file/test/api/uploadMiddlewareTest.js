let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
let filename = __dirname+'/file/test.png';

describe('uploadMiddlewareTest', () => {
    
    testHelpers.authTestEmployee();
    
    it('/upload', (done) => {
        testIniter.getChaiRequest()
            .post("/file/upload")
            .attach('file', filename)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
});