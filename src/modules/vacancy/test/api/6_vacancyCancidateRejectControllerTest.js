let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:auth', () => {

    testHelpers.authTestCompany();

    it('vacancyCandidateRejectController should delete employee from vacancy', (done) => {
        testIniter.getChaiRequest()
            .post("/vacancy/1/candidate/2/reject")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.data.should.be.eql('success');
                done();
            });
    });

    testHelpers.logout();
});