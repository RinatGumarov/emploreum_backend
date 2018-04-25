let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:employee', () => {
    
    testHelpers.authTestEmployee();
    
    it('updateEmployeeSkillsController should update employee skills', (done) => {
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
    
    testHelpers.logout();
});