let testIniter = require('../../../../core/tests/testIniter');
let cookies;
let user;
let userService = require('../../services/userService');
const companyService = require('../../../company/services/companyService');
const employeeService = require('../../../employee/services/employeeService');

const assert = testIniter.getAssert();

describe('module:auth', () => {
    /**
     * Один файл так как небоходим тестинг flow
     */
    describe('signupEmailController company registration flow', () => {
        it('should create new company', (done) => {
            const email = "kzn.magomedov@gmail.com";
            testIniter.getChaiRequest()
                .post("/auth/signup/email")
                .set("Content-Type", "application/json")
                .send({
                    email,
                    password: "asdasd123",
                    passwordConfirmation: "asdasd123",
                    role: "COMPANY"
                })
                .end(function (err, res) {
                    /** для того чтобы сессия всегда была одна и таже */
                    cookies = res.headers['set-cookie'].pop().split(';')[0];
                    res.should.have.status(200);
                    user = userService.getUserByEmail(email);
                    assert(user, 'User with role COMPANY wasn\'t created');
                    done();
                });
        });

        it('signupVerificationController should verify company', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/verification")
                .set('Cookie', cookies)
                .set("Content-Type", "application/json")
                .send({verifyCode: "111111"})
                .end(function (err, res) {
                    res.should.have.status(200);
                    const company = companyService.findByUserId(user.id);
                    assert(company, 'Company wasn\'t created after verification');
                    done()
                });
        });

        it('signupSpecificationController should add specification to company', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/specification")
                .set('Cookie', cookies)
                .set("Content-Type", "application/json")
                .send({
                    "specifications": [{
                        "id": 1,
                        "name": "web",
                    }, {
                        "id": 2,
                        "name": "mobile"
                    }]
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    done()
                });
        });
        it('signupInfoController should add languages to company', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/info")
                .set('Cookie', cookies)
                .set("Content-Type", "application/json")
                .send({
                    languages: [1],
                    name: "test"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    done()
                });
        });
    });

    describe('employee registration flow', () => {

        it('signupEmailController should create user', (done) => {
            const email = "kzn.magomedov2@gmail.com";
            testIniter.getChaiRequest()
                .post("/auth/signup/email")
                .set("Content-Type", "application/json")
                .send({
                    email,
                    password: "asdasd123",
                    passwordConfirmation: "asdasd123",
                    role: "EMPLOYEE"
                })
                .end(function (err, res) {
                    /** для того чтобы сессия всегда была одна и таже */
                    cookies = res.headers['set-cookie'].pop().split(';')[0];
                    res.should.have.status(200);
                    user = userService.getUserByEmail(email);
                    assert(user, 'User with role EMPLOYEE wasn\'t created');
                    done();
                });

        });

        it('signupVerificationController', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/verification")
                .set('Cookie', cookies)
                .set("Content-Type", "application/json")
                .send({verifyCode: "111111"})
                .end(function (err, res) {
                    res.should.have.status(200);
                    const employee = employeeService.getByUserId(user.id);
                    assert(employee, 'Employee wasn\'t created after verification');
                    done()
                });
        });

        it('signupSpecificationController', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/specification")
                .set('Cookie', cookies)
                .set("Content-Type", "application/json")
                .send({
                    "specifications": [{
                        "id": 1,
                        "name": "web",
                        "skills": [
                            {
                                "id": 1

                            }, {
                                "id": 3

                            }
                        ]
                    }]
                })
                .end(function (err, res) {
                    console.log(err);
                    res.should.have.status(200);
                    done()
                });
        });
        it('signupInfoController', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/info")
                .set('Cookie', cookies)
                .set("Content-Type", "application/json")
                .send({
                    languages: [1],
                    name: "test"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    done()
                });
        });
    });
});
