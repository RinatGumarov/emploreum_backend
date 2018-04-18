let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:vacancy', () => {
    
    testHelpers.authTestCompany();
    
    it('vacancyCandidatesController', (done) => {
        testIniter.getChaiRequest()
            .get("/vacancy/1/candidates")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
});