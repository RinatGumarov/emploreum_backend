let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('userController', () => {
    
    testHelpers.authTestEmployee();
    
    it('/user/languages', (done) => {
        testIniter.getChaiRequest()
            .get("/user/languages")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
});