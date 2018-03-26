let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('chatController', () => {
    
    testHelpers.authTestEmployee();
    
    it('/message/chats/all', (done) => {
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