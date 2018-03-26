let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('testController', () => {
    
    testHelpers.authTestCompany();
    
    it('/company/create', (done) => {
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
    
    it('/:testId([0-9]+)', (done) => {
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
                done();
            });
    });
    
    testHelpers.logout();
    
    testHelpers.authTestEmployee();
    
    it('/vacancy/:id([0-9]+)', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/vacancy/${testIniter.getRequestSession("vacancyId")}`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/:vacancyId([0-9]+)/start', (done) => {
        testIniter.getChaiRequest()
            .get(`/test/${testIniter.getRequestSession("vacancyId")}/start`)
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                done();
            });
    });
    
    testHelpers.logout();
    
});