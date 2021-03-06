let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:languages', () => {
    
    testHelpers.authTestEmployee();
    
    it('allLanguageController', (done) => {
        testIniter.getChaiRequest()
            .get("/language/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    
    testHelpers.logout();
    
});