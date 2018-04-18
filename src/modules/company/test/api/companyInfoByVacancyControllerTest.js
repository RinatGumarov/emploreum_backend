let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:company', () => {
    
    testHelpers.authTestCompany();
    
    it('companyInfoByVacancyController', (done) => {
        testIniter.getChaiRequest()
            .get("/company/info/vacancy/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
});