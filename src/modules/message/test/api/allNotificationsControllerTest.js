let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:message', () => {
    
    testHelpers.authTestEmployee();
    
    it('allNotificationsController', (done) => {
        testIniter.getChaiRequest()
            .get("/message/notifications")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
});