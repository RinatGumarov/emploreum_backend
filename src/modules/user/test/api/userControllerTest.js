let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');
let filters = encodeURIComponent(JSON.stringify({
    "keywords": ["dev"], "profileSkills": [{"profileId": 1, "skillId": 1}], "languages": [{"id": 1}]
}));
describe('userController', () => {
    
    testHelpers.authTestEmployee();
    
    it('/user/languages', (done) => {
        testIniter.getChaiRequest()
            .get("/user/languages")
            .set('Cookie', testIniter.getCookie())
            .set("Content-Type", "application/json")
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
    
    testHelpers.logout();
    
    it('/user/search', (done) => {
        testIniter.getChaiRequest()
            .get("/user/search?filters=" + filters)
            .set("Content-Type", "application/json")
            .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                done();
            });
    });
    
});

