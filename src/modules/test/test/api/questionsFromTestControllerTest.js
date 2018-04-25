let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
let testModuleHelper = require('./helpers/testModuleHelpers');

describe('module:test', () => {
    
    testModuleHelper.createTest();
    
    testHelpers.authTestCompany();
    it('questionsFromTestController should return all questions by testId', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/${testIniter.getRequestSession("testId")}/questions`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                testIniter.setRequestSession("questionId", res.body[0].id);
                res.body.should.be.a('array');
                done();
            });
    });
    testHelpers.logout();
});