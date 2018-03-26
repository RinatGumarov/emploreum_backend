let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('employeeController', () => {
    
    testHelpers.authTestEmployee();
    
    it('/vacancy/enroll/:vacancyId([0-9]+)', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/vacancy/enroll/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/vacancy/recommended', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/vacancy/recommended")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/all', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
});