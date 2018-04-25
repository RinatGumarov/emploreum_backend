const testIniter = require('../../../../core/tests/testIniter');
const testHelpers = require('../../../../core/tests/testHelpers');
const companyService = require('../../services/companyService');
const assert = testIniter.getAssert();

describe('module:company', () => {

    testHelpers.authTestCompany();

    it('updateCompanyInfoController should update company info', (done) => {
        const about = 'new about info';
        testIniter.getChaiRequest()
            .post("/company/update")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({about})
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    testHelpers.logout();
});