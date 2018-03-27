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
    
    describe('employee search ', () => {
        it('/user/search', (done) => {
            testIniter.getChaiRequest()
                .get("/user/search?filters=" + employeeFilters)
                .set("Content-Type", "application/json")
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe('vacancy search ', () => {
        
        it('/user/search', (done) => {
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

