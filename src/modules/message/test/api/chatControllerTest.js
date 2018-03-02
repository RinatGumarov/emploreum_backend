let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
var cookies;

describe('chatController', () => {
    
    testHelpers.authTestEmployee();
    
    it('get all chats for employee', (done) => {
        testIniter.getChaiRequest()
            .get("/message/chats/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    
    testHelpers.logout();
    
    testHelpers.authTestCompany();
    
    it('get all chats for company', (done) => {
        testIniter.getChaiRequest()
            .get("/message/chats/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
    
});