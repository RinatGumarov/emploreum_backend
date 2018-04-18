let testIniter = require('../../../../core/tests/testIniter');
let testHelpers = require('../../../../core/tests/testHelpers');

let baseFilters = {
    "keywords": ["dev"],
    "profileSkills": [{"profileId": 1, "skillId": 1}],
    "languages": [{"id": 1}],
};

let employeeFilters = baseFilters;
employeeFilters.type = "employees";
employeeFilters = encodeURIComponent(JSON.stringify(employeeFilters));

let vacancyFilters = baseFilters;
vacancyFilters.type = "vacancies";
vacancyFilters = encodeURIComponent(JSON.stringify(vacancyFilters));

describe('module:user', () => {
    
    describe('userSearchController', () => {
        it('employee search', (done) => {
            testIniter.getChaiRequest()
                .get("/user/search?filters=" + employeeFilters)
                .set("Content-Type", "application/json")
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
        it('vacancy search ', (done) => {
            testIniter.getChaiRequest()
                .get("/user/search?filters=" + vacancyFilters)
                .set("Content-Type", "application/json")
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

