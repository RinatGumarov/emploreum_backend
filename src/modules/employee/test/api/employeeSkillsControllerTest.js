let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:employee', () => {
    
    testHelpers.authTestEmployee();
    
    it('employeeSkillsController', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/skills/2")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
});