let testIniter = require('../../../../core/tests/testIniter');
var cookies;

describe('authController', () => {
    
    it('send not exist email', (done) => {
        testIniter.getChaiRequest()
            .post("/auth/login")
            .set("Content-Type", "application/json")
            .send({
                email: "test@test.ru",
                password: "asdasd123",
            })
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });
    
    it('send not valid password', (done) => {
        testIniter.getChaiRequest()
            .post("/auth/login")
            .set("Content-Type", "application/json")
            .send({
                email: "a@a.ru",
                password: "123123",
            })
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });
    
    it('send valid user credentials', (done) => {
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
    
    it('logout not auth user', (done) => {
        testIniter.getChaiRequest()
            .get("/auth/logout")
            .set("Content-Type", "application/json")
            .end(function (err, res) {
                res.should.have.status(403);
                done();
            });
    });
    
    
});