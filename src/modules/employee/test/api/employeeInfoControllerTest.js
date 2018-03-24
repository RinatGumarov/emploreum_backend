let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('employeeController', () => {
    
    testHelpers.authTestEmployee();
    
    
    it('employee info', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/info/2")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                done();
            });
    });
    
    it('auth employee info', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/info")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('languages');
                done();
            });
    });
    
    it('employee auth info update', (done) => {
        testIniter.getChaiRequest()
            .post("/employee/info/update")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send({
                languages: [1],
                name: "test2"
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('employee skills', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/skills/2")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('skills');
                res.body[0].skills.should.be.a('array');
                res.body[0].skills[0].should.have.property('name');
                done();
            });
    });
    
    it('employee auth specifications', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/skills")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    
    it('employee auth specifications update', (done) => {
        testIniter.getChaiRequest()
            .post("/employee/skills/update")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .send([{
                "id": 1,
                "name": "web",
                "skills": [
                    {
                        "id": 1
                        
                    }, {
                        "id": 3
                        
                    }
                ]
            }])
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('employee awaited contracts', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/contracts/awaited")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                done();
            });
    });
    
    
    it('employee current contracts', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/contracts/current")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
    
    
});