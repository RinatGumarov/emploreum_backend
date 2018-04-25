let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:vacancy', () => {

    testHelpers.authTestEmployee();

    it('enrollVacancyController should add employee to vacancy', (done) => {
        testIniter.getChaiRequest()
            .get("/vacancy/enroll/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.data.should.be.eql('success');
                done();
            });
    });

});