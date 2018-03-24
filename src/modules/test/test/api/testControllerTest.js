let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('testController', () => {
    
    testHelpers.authTestCompany();
    
    it('create test for vacancy by company', (done) => {
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
                res.body.should.be.a('string');
                testIniter.setRequestSession("testId", res.body);
                done();
            });
    });
    
    it('create question for test', (done) => {
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
                res.body.should.have.property('data');
                res.body.data.should.equal('success');
                done();
            });
    });
    
    it('get info about test for owner company', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/${testIniter.getRequestSession("testId")}`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("specifications");
                res.body.should.have.property("questions");
                res.body.specifications.should.be.a("array");
                res.body.questions.should.be.a("array");
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
    
    it('get vacancy test', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/vacancy/${testIniter.getRequestSession("vacancyId")}`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("questions");
                done();
            });
    });
    
    it('start vacancy test', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/${testIniter.getRequestSession("vacancyId")}/start`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                done();
            });
    });
    
    it('get test questions for employee', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/${testIniter.getRequestSession("testId")}/questions`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body[0].should.be.a("object");
                res.body[0].should.have.property("answers");
                res.body[0].answers.should.be.a("array");
                testIniter.setRequestSession("questionId", res.body[0].id);
                done();
            });
    });
    
    
    it('pass questions answers', (done) => {
        testIniter.getChaiRequest()
            .post(`/test/question/${testIniter.getRequestSession("questionId")}/answer`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send([3,4])
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("data");
                res.body.data.should.equal('success');
                done();
            });
    });
    
    it('end test for employee', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/${testIniter.getRequestSession("vacancyId")}/submit`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("data");
                res.body.data.should.equal('success');
                done();
            });
    });
    
    testHelpers.logout();
    
});