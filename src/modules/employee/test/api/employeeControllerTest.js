let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

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
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('info');
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