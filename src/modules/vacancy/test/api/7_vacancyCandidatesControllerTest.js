let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:vacancy', () => {

    testHelpers.authTestCompany();

    it('vacancyCandidatesController should return vacancy candidates', (done) => {
        testIniter.getChaiRequest()
            .get("/vacancy/1/candidates")
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