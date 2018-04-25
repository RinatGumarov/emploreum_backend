let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:employee', () => {

    testHelpers.authTestEmployee();

    it('employeeInfoController should return employee\'s info by id', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/info/2")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.name.should.be.eql('nasorog');
                done();
            });
    });

    testHelpers.logout();

});