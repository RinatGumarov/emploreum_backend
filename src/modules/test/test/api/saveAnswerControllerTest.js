let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
let testModuleHelper = require('./helpers/testModuleHelpers');

describe('module:test', () => {
    
    
    testModuleHelper.startTest();
    
    testHelpers.authTestEmployee();
    it('saveAnswerController', (done) => {
        testIniter.getChaiRequest()
            .post(`/test/question/${testIniter.getRequestSession("questionId")}/answer`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send([3, 4])
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    testHelpers.logout();
});

