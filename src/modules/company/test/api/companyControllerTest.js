let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
var cookies;

describe('companyController', () => {
    
    it('get company info for not auth user', (done) => {
        testIniter.getChaiRequest()
            .get("/company")
            .set("Content-Type", "application/json")
            .end(function (err, res) {
                res.should.have.status(403);
                done();
            });
    });
    
    testHelpers.authTestEmployee();
    
    it('get company info for employee', (done) => {
        testIniter.getChaiRequest()
            .get("/company")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(403);
                done();
            });
    });
    
    it('update company property for employee', (done) => {
        testIniter.getChaiRequest()
            .post("/company/update")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(403);
                done();
            });
    });
    
    
    testHelpers.logout();
    
    testHelpers.authTestCompany();
    
    it('get company info', (done) => {
        testIniter.getChaiRequest()
            .get("/company")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('about');
                res.body.should.have.property('name');
                res.body.should.have.property('city');
                res.body.should.have.property('user_id');
                res.body.should.have.property('response_text');
                res.body.should.have.property('logo');
                res.body.should.have.property('contract');
                done();
            });
    });
    
    testHelpers.logout();
});