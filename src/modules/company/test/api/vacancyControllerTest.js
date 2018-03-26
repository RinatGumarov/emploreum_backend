let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('vacancyController', () => {
    
    testHelpers.authTestEmployee();
    
    it('/company/vacancy/:vacancyId([0-9]+)/available', (done) => {
        testIniter.getChaiRequest()
            .get("/company/vacancy/1/available")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
    
    testHelpers.authTestCompany();
    it('/company/vacancy/create', (done) => {
        testIniter.getChaiRequest()
            .post("/company/vacancy/create")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({
                name: "test_vacancy",
                specifications: [{
                    id: 1,
                    skills: [{
                        id: 1
                    }]
                }]
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    it('/company/vacancy/info/:id([0-9]+)', (done) => {
        testIniter.getChaiRequest()
            .get("/company/vacancy/info/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/company/vacancy/:id([0-9]+)/specification', (done) => {
        testIniter.getChaiRequest()
            .get("/company/vacancy/1/specification")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/company/vacancy/:id([0-9]+)/candidates', (done) => {
        testIniter.getChaiRequest()
            .get("/company/vacancy/1/candidates")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/vacancy/:vacancyId([0-9]+)/candidate/:candidatesId([0-9]+)/reject', (done) => {
        testIniter.getChaiRequest()
            .post("/company/vacancy/1/candidate/2/reject")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/vacancy/:id([0-9]+)/invite', (done) => {
        testIniter.getChaiRequest()
            .post("/company/vacancy/1/invite")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({employeeId: 2})
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
    
});