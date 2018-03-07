let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
var cookies;

describe('vacancyController', () => {
    
    testHelpers.authTestEmployee();
    
    it(' is allowed vacancy to employee', (done) => {
        testIniter.getChaiRequest()
            .get("/company/vacancy/1/available")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({})
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
    describe('create vacancy', () => {
        
        testHelpers.authTestCompany();
        
        it(' send not valid json', (done) => {
            testIniter.getChaiRequest()
                .post("/company/vacancy/create")
                .set("Content-Type", "application/json")
                .set('Cookie', testIniter.getCookie())
                .send({})
                .end(function (err, res) {
                    res.should.have.status(500);
                    done();
                });
        });
        
        
        it('send valid json', (done) => {
            testIniter.getChaiRequest()
                .post("/company/vacancy/create")
                .set("Content-Type", "application/json")
                .set('Cookie', testIniter.getCookie())
                .send({
                    name: "test_vacancy",
                    specifications: [{
                        id: 1,
                        skills: [{
                            id: 1
                        }]
                    }]
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('info');
                    res.body.should.have.property('name');
                    res.body.should.have.property('duration');
                    res.body.should.have.property('opened');
                    done();
                });
        });
        
        testHelpers.logout();
    });
    
    testHelpers.authTestCompany();
    
    it('get company vacancies', (done) => {
        testIniter.getChaiRequest()
            .get("/company/vacancy")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('info');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('duration');
                res.body[0].should.have.property('opened');
                done();
            });
    });
    
    
    it('get vacancy info', (done) => {
        testIniter.getChaiRequest()
            .get("/company/vacancy/info/1")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('info');
                res.body.should.have.property('name');
                res.body.should.have.property('duration');
                res.body.should.have.property('opened');
                done();
            });
    });
    
    it('get vacancy specification', (done) => {
        testIniter.getChaiRequest()
            .get("/company/vacancy/1/specification")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('skills');
                res.body[0].skills.should.be.a('array');
                res.body[0].skills[0].should.be.a('object');
                res.body[0].skills[0].should.have.property('name');
                done();
            });
    });
    
    it('get vacancy candidates', (done) => {
        testIniter.getChaiRequest()
            .get("/company/vacancy/1/candidates")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('user');
                done();
            });
    });
    
    it('get vacancy candidates', (done) => {
        testIniter.getChaiRequest()
            .get("/company/vacancy/1/candidates")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('user');
                done();
            });
    });
    
    it('reject candidates', (done) => {
        testIniter.getChaiRequest()
            .post("/company/vacancy/1/candidate/2/reject")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('invite candidates', (done) => {
        testIniter.getChaiRequest()
            .post("/company/vacancy/1/invite")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({employeeId: 2})
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
    
});