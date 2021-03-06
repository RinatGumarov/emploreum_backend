let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:employee', () => {
    
    testHelpers.authTestEmployee();
    
    it('employeeCurrentContractController', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/contracts/current")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
});