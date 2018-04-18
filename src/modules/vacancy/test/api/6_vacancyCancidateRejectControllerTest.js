let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:auth', () => {
    
    testHelpers.authTestCompany();
    
    it('vacancyCandidateRejectController', (done) => {
        testIniter.getChaiRequest()
            .post("/vacancy/1/candidate/2/reject")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
    
});