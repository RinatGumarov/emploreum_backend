let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:user', () => {
    
    testHelpers.authTestEmployee();
    
    it('userLanguagesController', (done) => {
        testIniter.getChaiRequest()
            .get("/user/languages")
            .set('Cookie', testIniter.getCookie())
            .set("Content-Type", "application/json")
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
});

