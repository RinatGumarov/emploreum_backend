let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:company', () => {
    
    testHelpers.authTestCompany();
    
    it('updateCompanyInfoController', (done) => {
        testIniter.getChaiRequest()
            .post("/company/update")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({about: "123"})
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
});