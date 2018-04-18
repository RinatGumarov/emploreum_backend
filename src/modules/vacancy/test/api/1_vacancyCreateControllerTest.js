let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('module:vacancy', () => {
    
    testHelpers.authTestCompany();
    
    it('vacancyCreateController', (done) => {
        testIniter.getChaiRequest()
            .post("/vacancy/create")
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
                done();
            });
    });
    
    testHelpers.logout();
    
    
});