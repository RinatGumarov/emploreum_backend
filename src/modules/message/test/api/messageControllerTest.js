let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
var cookies;

describe('messageController', () => {
    
    testHelpers.authTestEmployee();
    
    it('get all message from chat for employee', (done) => {
        testIniter.getChaiRequest()
            .get("/message/chat/1/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('text');
                res.body[0].should.have.property('isEmployeeMessage');
                res.body[0].should.have.property('isCompanyMessage');
                done();
            });
    });
    
    testHelpers.logout();
    
    testHelpers.authTestCompany();
    
    it('get all message from chat for company', (done) => {
        testIniter.getChaiRequest()
            .get("/message/chat/1/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('text');
                res.body[0].should.have.property('isEmployeeMessage');
                res.body[0].should.have.property('isCompanyMessage');
                done();
            });
    });
    
    testHelpers.logout();
    
    
});