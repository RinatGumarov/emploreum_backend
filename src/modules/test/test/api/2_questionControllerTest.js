let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('questionController', () => {
    
    testHelpers.authTestCompany();
    
    it('/:testId([0-9]+)/question/create', (done) => {
        testIniter.getChaiRequest()
            .post(`/test/${testIniter.getRequestSession("testId")}/question/create`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({
                "question": {
                    "type": "multipleChoice",
                    "name": "1+22",
                    "answers": [{
                        "name": "3",
                        "isTrue": false
                    }, {
                        "name": "4",
                        "isTrue": false
                    }, {
                        "name": "23",
                        "isTrue": true
                    }]
                },
                "difficulty": "2"
            })
            .end(function (err, res) {
                testIniter.setRequestSession("questionId", res.body.id);
                res.should.have.status(200);
                done();
            });
    });
    
    
    it('/:testId([0-9]+)/questions', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/${testIniter.getRequestSession("testId")}/questions`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                testIniter.setRequestSession("questionId", res.body[0].id);
                done();
            });
    });
    
    testHelpers.logout();
    
});