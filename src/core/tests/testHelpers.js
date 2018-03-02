const testIniter = require("./testIniter");

let testHelpersInstance;

class TestHelpers {
    
    /***
     * инициализирова куку инитсендора , будто-бы прошла аунтефикация
     * за тестовую компанию
     * все функции без обрашения к обьекту создает mocha
     */
    authTestCompany() {
        it("[ auth for company ]",(done) => {
            testIniter.getChaiRequest()
                .post("/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    email: "a@a.ru",
                    password: "1",
                })
                .end(function (err, res) {
                    testIniter.setCookie(res.headers['set-cookie'].pop().split(';')[0]);
                    res.should.have.status(200);
                    done();
                });
        });
    }
    
    /***
     * инициализирова куку инитсендора , будто-бы прошла аунтефикация
     * за тестового сотрудника
     */
    authTestEmployee() {
        it("[ auth for employee ]",(done) => {
            testIniter.getChaiRequest()
                .post("/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    email: "b@b.ru",
                    password: "1",
                })
                .end(function (err, res) {
                    testIniter.setCookie(res.headers['set-cookie'].pop().split(';')[0]);
                    res.should.have.status(200);
                    done();
                });
        });
    }
    
    /**
     * выход из пользователя
     */
    logout() {
        it("[ user logout ]",(done) => {
            testIniter.getChaiRequest()
                .get("/auth/logout")
                .set("Content-Type", "application/json")
                .set('Cookie', testIniter.getCookie())
                .end(function (err, res) {
                    done();
                });
        });
    }
    
}

testHelpersInstance = new TestHelpers();
module.exports = testHelpersInstance;