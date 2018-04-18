let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:specialisation', () => {
    
    testHelpers.authTestEmployee();
    
    it('skillsFromProfileController', (done) => {
        testIniter.getChaiRequest()
            .get("/specialisation/skills/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    
    testHelpers.logout();
    
});