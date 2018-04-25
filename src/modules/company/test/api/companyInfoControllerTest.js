let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:company', () => {

    it('companyInfoController', (done) => {
        testIniter.getChaiRequest()
            .get("/company/info/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.about.should.be.eql('sberkek company. we make products for sberbank');
                done();
            });
    });

});