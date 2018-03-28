let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

describe('profileSkillController', () => {
    it('/profileSkills', (done) => {
        testIniter.getChaiRequest()
            .get("/specialisation/profileSkills")
            .set("Content-Type", "application/json")
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
});