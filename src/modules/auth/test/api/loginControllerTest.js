let testIniter = require('../../../../core/tests/testIniter');

describe('module:auth', () => {
    it('loginController', (done) => {
        testIniter.getChaiRequest()
            .post("/auth/login")
            .set("Content-Type", "application/json")
            .send({
                email: "a@a.ru",
                password: "1",
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
});
