const testIniter = require("../../../../../core/tests/testIniter");
const testHelpers = require("../../../../../core/tests/testHelpers");

let testModuleHelpers;

class TestModuleHelpers {
    
    /** создать и тест и получить его id */
    createTest() {
        testHelpers.authTestCompany();
        it("[ create test ]", (done) => {
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
        
        it('[ create questions for test ]', (done) => {
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
        
        
        testHelpers.logout();
    }
    
    /** создать вакансию с тестами */
    createVacancyWithTest() {
        this.createTest();
        testHelpers.authTestCompany();
        it('[ create vacancy with test ]', (done) => {
            testIniter.getChaiRequest()
                .post("/vacancy/create")
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
                    done();
                });
        });
        testHelpers.logout();
    }
    
    startTest() {
        this.createVacancyWithTest();
        testHelpers.authTestEmployee();
        it('[ start test ]', (done) => {
            testIniter.getChaiRequest()
                .get(`/test/${testIniter.getRequestSession("vacancyId")}/start`)
                .set("Content-Type", "application/json")
                .set('Cookie', testIniter.getCookie())
                .end(function (err, res) {
                    done();
                });
        });
        testHelpers.logout();
    }
}

testModuleHelpers = new TestModuleHelpers();
module.exports = testModuleHelpers;