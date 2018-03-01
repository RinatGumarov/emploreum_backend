let testIniter = require('../../../../core/tests/testIniter');
var cookies;

describe('regController', () => {
    /**
     * test regitration company flow
     */
    describe('company flow', () => {
        it('send exist email', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/email")
                .set("Content-Type", "application/json")
                .send({
                    email: "a@a.ru",
                })
                .end(function (err, res) {
                    /** для того чтобы сессия всегда была одна и таже */
                    cookies = res.headers['set-cookie'].pop().split(';')[0];
                    res.should.have.status(400);
                    res.body.should.be.a('string');
                    done();
                });
            
        });
        it('send not equal password', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/email")
                .set("Content-Type", "application/json")
                .send({
                    email: "kzn.magomedov@gmail.com",
                    password: "asdasd123",
                    passwordConfirmation: "asdasd",
                    role: "COMPANY"
                })
                .end(function (err, res) {
                    /** для того чтобы сессия всегда была одна и таже */
                    cookies = res.headers['set-cookie'].pop().split(';')[0];
                    res.should.have.status(400);
                    res.body.should.be.a('string');
                    done();
                });
        });
        it('send normal email', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/email")
                .set("Content-Type", "application/json")
                .send({
                    email: "kzn.magomedov@gmail.com",
                    password: "asdasd123",
                    passwordConfirmation: "asdasd123",
                    role: "COMPANY"
                })
                .end(function (err, res) {
                    /** для того чтобы сессия всегда была одна и таже */
                    cookies = res.headers['set-cookie'].pop().split(';')[0];
                    res.should.have.status(200);
                    done();
                });
        });
        describe('verification', () => {
            it('send not valid code', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/verification")
                    .set('Cookie', cookies)
                    .set("Content-Type", "application/json")
                    .send({verifyCode: "not valid code"})
                    .end(function (err, res) {
                        res.should.have.status(400);
                        done()
                    });
            });
            it('verification user and save', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/verification")
                    .set('Cookie', cookies)
                    .set("Content-Type", "application/json")
                    .send({verifyCode: "111111"})
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('registrationStep');
                        res.body.should.have.property('role');
                        res.body.should.have.property('userId');
                        res.body.role.should.equal('COMPANY');
                        res.body.registrationStep.should.equal(1);
                        done()
                    });
            });
        });
        describe('specification', () => {
            it('info step frobidden', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/info")
                    .set('Cookie', cookies)
                    .set("Content-Type", "application/json")
                    .send({})
                    .end(function (err, res) {
                        res.should.have.status(403);
                        done()
                    });
            });
            it('send request for not auth user', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/specification")
                    .set("Content-Type", "application/json")
                    .end(function (err, res) {
                        res.should.have.status(403);
                        done()
                    });
            });
            it('send not valid json', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/specification")
                    .set('Cookie', cookies)
                    .set("Content-Type", "application/json")
                    .send({})
                    .end(function (err, res) {
                        res.should.have.status(500);
                        done()
                    });
            });
            it('send not exist profile', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/specification")
                    .set('Cookie', cookies)
                    .set("Content-Type", "application/json")
                    .send({
                        "specifications": [{
                            "id": 0,
                        }]
                    })
                    .end(function (err, res) {
                        res.should.have.status(500);
                        done()
                    });
            });
            it('send normal specifications', (done) => {
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
                        res.body.should.be.a('object');
                        res.body.should.have.property('registrationStep');
                        res.body.should.have.property('userId');
                        res.body.registrationStep.should.equal(2);
                        done()
                    });
            });
            
            
        });
        
        describe('info', () => {
            it('send for not auth user', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/info")
                    .end(function (err, res) {
                        res.should.have.status(403);
                        done()
                    });
            });
            it('send normal info', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/info")
                    .set('Cookie', cookies)
                    .set("Content-Type", "application/json")
                    .send({
                        name: "test"
                    })
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('registrationStep');
                        res.body.should.have.property('userId');
                        res.body.registrationStep.should.equal(3);
                        done()
                    });
            });
        });
    });
    
    /**
     * test regitration employee flow
     */
    describe('employee flow', () => {
        
        it('send normal email', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/email")
                .set("Content-Type", "application/json")
                .send({
                    email: "kzn.magomedov2@gmail.com",
                    password: "asdasd123",
                    passwordConfirmation: "asdasd123",
                    role: "EMPLOYEE"
                })
                .end(function (err, res) {
                    /** для того чтобы сессия всегда была одна и таже */
                    cookies = res.headers['set-cookie'].pop().split(';')[0];
                    res.should.have.status(200);
                    done();
                });
            
        });
        
        describe('verification', () => {
            it('verification user and save', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/verification")
                    .set('Cookie', cookies)
                    .set("Content-Type", "application/json")
                    .send({verifyCode: "111111"})
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('registrationStep');
                        res.body.should.have.property('role');
                        res.body.should.have.property('userId');
                        res.body.role.should.equal('EMPLOYEE');
                        res.body.registrationStep.should.equal(1);
                        done()
                    });
            });
        });
        describe('specification', () => {
            it('send not exist profile', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/specification")
                    .set('Cookie', cookies)
                    .set("Content-Type", "application/json")
                    .send({
                        "specifications": [{
                            "id": 0,
                        }]
                    })
                    .end(function (err, res) {
                        res.should.have.status(500);
                        done()
                    });
            });
            it('send not valid json', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/specification")
                    .set('Cookie', cookies)
                    .set("Content-Type", "application/json")
                    .send({
                        "specifications": [{
                            "id": 1,
                            "name": "web",
                            "skills": [{}]
                        }]
                    })
                    .end(function (err, res) {
                        res.should.have.status(500);
                        done()
                    });
            });
            it('send not exist skill', (done) => {
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
                                    "id": 0
                                }
                            ]
                        }]
                    })
                    .end(function (err, res) {
                        res.should.have.status(500);
                        done()
                    });
            });
            it('send normal specifications', (done) => {
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
                        res.body.should.be.a('object');
                        res.body.should.have.property('registrationStep');
                        res.body.should.have.property('userId');
                        res.body.registrationStep.should.equal(2);
                        done()
                    });
            });
        });
        describe('info', () => {
            it('send for not auth user', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/info")
                    .end(function (err, res) {
                        res.should.have.status(403);
                        done()
                    });
            });
            it('send normal info', (done) => {
                testIniter.getChaiRequest()
                    .post("/auth/signup/info")
                    .set('Cookie', cookies)
                    .set("Content-Type", "application/json")
                    .send({
                        name: "test"
                    })
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('registrationStep');
                        res.body.should.have.property('userId');
                        res.body.registrationStep.should.equal(3);
                        done()
                    });
            });
        });
    });
});