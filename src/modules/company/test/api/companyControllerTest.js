let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('companyController', () => {
    
    testHelpers.authTestCompany();
    
    it('/company', (done) => {
        testIniter.getChaiRequest()
            .get("/company")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/company/update', (done) => {
        testIniter.getChaiRequest()
            .post("/company/update")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({about: "123"})
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/company/info/vacancy/:id([0-9]+)', (done) => {
        testIniter.getChaiRequest()
            .get("/company/info/vacancy/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
   
    testHelpers.logout();
    
    it('/company/:companyId([0-9]+)/vacancies', (done) => {
        testIniter.getChaiRequest()
            .get("/company/1/vacancies")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
    
    it('/company/info/:id([0-9]+)', (done) => {
        testIniter.getChaiRequest()
            .get("/company/info/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
});