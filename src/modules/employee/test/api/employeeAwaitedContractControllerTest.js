let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:employee', () => {

    testHelpers.authTestEmployee();

    it('employeeAwaitedContractController should return all awaited contracts of employee', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/contracts/awaited")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    testHelpers.logout();

});