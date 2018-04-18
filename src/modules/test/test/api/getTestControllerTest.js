let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
let testModuleHelepr = require('./helpers/testModuleHelpers');

describe('module:test', () => {
    
    testModuleHelepr.createTest();
    
    testHelpers.authTestCompany();
    it('getTestController', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/${testIniter.getRequestSession("testId")}`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    testHelpers.logout();
});