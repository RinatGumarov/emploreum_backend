let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('languageController', () => {
    
    testHelpers.authTestEmployee();
    
    it('all languages', (done) => {
        testIniter.getChaiRequest()
            .get("/specialisation/languages")
            .set("Content-Type", "application/json")
            .set('Cookie', testIniter.getCookie())
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body[0].should.be.a("object");
                res.body[0].should.have.property("name");
                done();
            });
    });
    
    
    testHelpers.logout();
    
});