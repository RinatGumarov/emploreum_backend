let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('profileController', () => {
    
    testHelpers.authTestEmployee();
    
    it('/profiles', (done) => {
        testIniter.getChaiRequest()
            .get("/specialisation/profiles")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    
    testHelpers.logout();
    
});