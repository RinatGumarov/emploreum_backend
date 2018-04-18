let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:vacancy', () => {
    
    testHelpers.authTestCompany();
    
    it('inviteEmployeeController', (done) => {
        testIniter.getChaiRequest()
            .post("/vacancy/1/invite")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({employeeId: 2})
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
    
});