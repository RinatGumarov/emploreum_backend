let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('messageController', () => {
    
    testHelpers.authTestEmployee();
    it('/chat/:chatId([0-9]+)/all', (done) => {
        testIniter.getChaiRequest()
            .get("/message/chat/1/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    it('/create', (done) => {
        testIniter.getChaiRequest()
            .post("/message/create")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({chatId: 1,text:"text"})
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    testHelpers.logout();
});