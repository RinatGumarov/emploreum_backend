let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
var cookies;

describe('chatController', () => {
    
    testHelpers.authTestEmployee();
    
    it('get all chats for user', (done) => {
        testIniter.getChaiRequest()
            .get("/message/chats/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body[0].should.have.property("name");
                res.body[0].should.have.property("logo");
                done();
            });
    });
    
    testHelpers.logout();
    
    
});