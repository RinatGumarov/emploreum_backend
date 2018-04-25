let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:message', () => {

    testHelpers.authTestEmployee();
    it('messageFromChatController should return all message by chat id', (done) => {
        testIniter.getChaiRequest()
            .get("/message/chat/1/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
    testHelpers.logout();
});