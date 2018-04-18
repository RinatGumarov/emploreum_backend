let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:message', () => {
    
    testHelpers.authTestEmployee();
    it('messageCreateController', (done) => {
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