let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
var cookies;

describe('employeeController', () => {
    
    testHelpers.authTestEmployee();
    
    it('enroll vacancy', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/vacancy/enroll/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('recommended vacancy for employee', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/vacancy/recommended")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('info');
                done();
            });
    });
    
    it('employee info', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/info/2")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                done();
            });
    });
    
    it('employee skills', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/skills/2")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('skills');
                res.body[0].skills.should.be.a('array');
                res.body[0].skills[0].should.have.property('name');
                done();
            });
    });
    
    it('employee skills', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/skills/2")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('skills');
                res.body[0].skills.should.be.a('array');
                res.body[0].skills[0].should.have.property('name');
                done();
            });
    });
    
    it('employee awaited contracts', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/contracts/awaited")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                done();
            });
    });
    
    it('all employee', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                done();
            });
    });
    
});