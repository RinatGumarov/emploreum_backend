let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('companyController', () => {
    
    testHelpers.authTestCompany();
    
    it('get company info', (done) => {
        testIniter.getChaiRequest()
            .get("/company")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('about');
                res.body.should.have.property('name');
                res.body.should.have.property('city');
                res.body.should.have.property('userId');
                res.body.should.have.property('responseText');
                res.body.should.have.property('logo');
                res.body.should.have.property('contract');
                done();
            });
    });
    
    it('update company info', (done) => {
        testIniter.getChaiRequest()
            .post("/company/update")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({about: "123"})
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('company info by vacancy id', (done) => {
        testIniter.getChaiRequest()
            .get("/company/info/vacancy/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('about');
                res.body.should.have.property('name');
                res.body.should.have.property('city');
                res.body.should.have.property('userId');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('responseText');
                res.body.should.have.property('logo');
                res.body.should.have.property('contract');
                done();
            });
    });
    
    it('company test', (done) => {
        testIniter.getChaiRequest()
            .get("/company/tests")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('specifications');
                res.body[0].specifications.should.be.a('array');
                res.body[0].specifications[0].should.have.property('name');
                res.body[0].specifications[0].should.have.property('skills');
                res.body[0].specifications[0].skills.should.be.a('array');
                res.body[0].specifications[0].skills[0].should.have.property('name');
                done();
            });
    });
    
    testHelpers.logout();
    
    it("[ auth for new company reg in regControllerTest ]", (done) => {
        testIniter.getChaiRequest()
            .post("/auth/login")
            .set("Content-Type", "application/json")
            .send({
                email: "kzn.magomedov@gmail.com",
                password: "asdasd123",
            })
            .end(function (err, res) {
                res.should.have.status(200);
                testIniter.setCookie(res.headers['set-cookie'].pop().split(';')[0]);
                done();
            });
    });
    
    /**
     * тест работает только при включенном интернете
     */
    it('company indicators', (done) => {
        testIniter.getChaiRequest()
            .get("/company/indicators")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property("address");
                res.body.should.have.property("spending");
                res.body.should.have.property("balance");
                res.body.should.have.property("canBePaid");
                done();
            });
    });
    
    testHelpers.logout();
    
    it('get company vacancies', (done) => {
        testIniter.getChaiRequest()
            .get("/company/1/vacancies")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
    
    it('get company info by id', (done) => {
        testIniter.getChaiRequest()
            .get("/company/info/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('about');
                res.body.should.have.property('name');
                res.body.should.have.property('city');
                res.body.should.have.property('userId');
                res.body.should.have.property('createdAt');
                res.body.should.have.property('vacancies');
                res.body.should.have.property('responseText');
                res.body.should.have.property('logo');
                res.body.should.have.property('contract');
                done();
            });
    });
});