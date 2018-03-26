let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('answerController', () => {
    
    testHelpers.authTestEmployee();
    
    it('/question/:questionId([0-9]+)/answer', (done) => {
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
    
    
    describe('testController', () => {
        
        it('/test/:vacancyId([0-9]+)/submit', (done) => {
            testIniter.getChaiRequest()
                .get(`/test/${testIniter.getRequestSession("vacancyId")}/submit`)
                .set("Content-Type", "application/json")
                .set('Cookie', testIniter.getCookie())
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
        
    });

    testHelpers.logout();
});

