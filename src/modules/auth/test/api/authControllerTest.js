let testIniter = require('../../../../core/tests/testIniter');

describe('authController', () => {
    
    
    it('/auth/login', (done) => {
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
    
    it('/auth/logout', (done) => {
        testIniter.getChaiRequest()
            .get("/auth/logout")
            .set("Content-Type", "application/json")
            .end(function (err, res) {
                res.should.have.status(403);
                done();
            });
    });
    
    
});