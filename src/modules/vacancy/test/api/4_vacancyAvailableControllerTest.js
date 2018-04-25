let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:vacancy', () => {

    testHelpers.authTestEmployee();

    it('availableVacancyController', (done) => {
        testIniter.getChaiRequest()
            .get("/vacancy/1/available")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.eql('submitted');
                done();
            });
    });

    testHelpers.logout();
});