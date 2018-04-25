let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:employee', () => {
    
    testHelpers.authTestEmployee();
    
    it('updateEmployeeInfoController should update employee info', (done) => {
        testIniter.getChaiRequest()
            .post("/employee/info/update")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({
                languages: [1],
                name: "test2"
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
});