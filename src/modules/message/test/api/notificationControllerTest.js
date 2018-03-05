let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
var cookies;

describe('notificationController', () => {
    
    testHelpers.authTestEmployee();
    
    it('get all new notifications for employee', (done) => {
        testIniter.getChaiRequest()
            .get("/message/notifications")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('text');
                res.body[0].should.have.property('is_view');
                res.body[0].is_view.should.equal(false);
                done();
            });
    });
    
    it('reed all notifications', (done) => {
        testIniter.getChaiRequest()
            .get("/message/notifications/read")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    
    testHelpers.logout();
    
});