let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('testController', () => {
    
    testHelpers.authTestCompany();
    
    it('/test/company/create', (done) => {
        testIniter.getChaiRequest()
            .post("/test/company/create")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({
                "specifications": [
                    {
                        "id": "1",
                        "skills": [
                            {
                                "id": "1"
                            },
                            {
                                "id": "3"
                            }
                        ]
                    }
                ],
                "name": "test-test",
                "duration": "15"
            })
            .end(function (err, res) {
                res.should.have.status(200);
                testIniter.setRequestSession("testId", res.body);
                done();
            });
    });
    
    it('/test/:id([0-9]+)/question/create', (done) => {
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
                res.should.have.status(200);
                done();
            });
    });
    
    it('/test/:testId([0-9]+)', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/${testIniter.getRequestSession("testId")}`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    
    it('create vacancy with test', (done) => {
        testIniter.getChaiRequest()
            .post("/company/vacancy/create")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({
                name: "test_vacancy",
                testId: testIniter.getRequestSession("testId"),
                specifications: [{
                    id: 1,
                    skills: [{
                        id: 1
                    }]
                }]
            })
            .end(function (err, res) {
                testIniter.setRequestSession("vacancyId", res.body.id);
                testIniter.setRequestSession("testId", res.body.testId);
                done();
            });
    });
    
    testHelpers.logout();
    
    testHelpers.authTestEmployee();
    
    it('/test/vacancy/:id([0-9]+)', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/vacancy/${testIniter.getRequestSession("vacancyId")}`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/test/:vacancyId([0-9]+)/submit', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/${testIniter.getRequestSession("vacancyId")}/start`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                done();
            });
    });
    
    it('/test/:id([0-9]+)/questions', (done) => {
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
    
    
    it('/test/question/:questionId([0-9]+)/answer', (done) => {
        testIniter.getChaiRequest()
            .post(`/test/question/${testIniter.getRequestSession("questionId")}/answer`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send([3,4])
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
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
    
    testHelpers.logout();
    
});