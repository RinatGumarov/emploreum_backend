let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('employeeController', () => {
    
    testHelpers.authTestEmployee();
    
    
    it('/employee/info/:employeeUserId([0-9]+)', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/info/2")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/employee/info/update', (done) => {
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
    
    it('/employee/skills/:employeeUserId([0-9]+)', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/skills/2")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    it('/employee/skills/update', (done) => {
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
    
    it('/employee/contracts/awaited', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/contracts/awaited")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    
    it('/employee/contracts/current', (done) => {
        testIniter.getChaiRequest()
            .get("/employee/contracts/current")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    
});