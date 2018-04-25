let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:user', () => {

    testHelpers.authTestEmployee();

    it('userLanguagesController should return all languages', (done) => {
        testIniter.getChaiRequest()
            .get("/user/languages")
            .set('Cookie', testIniter.getCookie())
            .set("Content-Type", "application/json")
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    testHelpers.logout();

});

