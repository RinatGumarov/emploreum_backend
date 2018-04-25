let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:vacancy', () => {

    testHelpers.authTestCompany();

    it('vacancyInfoControllerTest should return vacancy by id', (done) => {
        testIniter.getChaiRequest()
            .get("/vacancy/info/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.name.should.be.eql('java jun dev');
                done();
            });
    });

    testHelpers.logout();


});