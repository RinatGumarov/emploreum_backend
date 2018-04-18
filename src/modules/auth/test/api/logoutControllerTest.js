let testIniter = require('../../../../core/tests/testIniter');

describe('module:auth', () => {
    it('logoutController', (done) => {
        testIniter.getChaiRequest()
            .get("/auth/logout")
            .set("Content-Type", "application/json")
            .end(function (err, res) {
                res.should.have.status(403);
                done();
            });
    });
});