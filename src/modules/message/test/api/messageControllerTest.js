let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('messageController', () => {
    
    testHelpers.authTestEmployee();
    it('get all message from chat for user', (done) => {
        testIniter.getChaiRequest()
            .get("/message/chat/1/all")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('text');
                res.body[0].should.have.property('createdAt');
                res.body[0].should.have.property('status');
                res.body[0].should.have.property('userId');
                done();
            });
    });
    it('send message', (done) => {
        testIniter.getChaiRequest()
            .post("/message/create")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({chatId: 1,text:"text"})
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('text');
                res.body.should.have.property('userId');
                res.body.should.have.property('chatId');
                done();
            });
    });
    testHelpers.logout();
});