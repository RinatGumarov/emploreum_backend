let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('notificationController', () => {
    
    testHelpers.authTestEmployee();
    
    it('/notifications', (done) => {
        testIniter.getChaiRequest()
            .get("/message/notifications")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/notifications/read', (done) => {
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