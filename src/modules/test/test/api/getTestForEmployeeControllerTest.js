let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
let testModuleHelepr = require('./helpers/testModuleHelpers');

describe('module:test', () => {
    
    
    testModuleHelepr.createVacancyWithTest();
    
    testHelpers.authTestEmployee();
    
    it('getTestForEmployeeController', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/vacancy/${testIniter.getRequestSession("vacancyId")}`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
});