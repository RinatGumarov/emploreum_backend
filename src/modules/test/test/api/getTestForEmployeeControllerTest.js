let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
let testModuleHelepr = require('./helpers/testModuleHelpers');

describe('module:test', () => {


    testModuleHelepr.createVacancyWithTest();

    testHelpers.authTestEmployee();

    it('getTestForEmployeeController should return test questions', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/vacancy/${testIniter.getRequestSession("vacancyId")}`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.name.should.be.eql('test-test');
                done();
            });
    });

    testHelpers.logout();

});