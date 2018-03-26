let testIniter = require('../../../../core/tests/testIniter');
var cookies;

describe('regController', () => {
    /**
     * test regitration company flow
     */
    describe('company flow', () => {
        it('/signup/email', (done) => {
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
        it('/signup/verification', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/verification")
                .set('Cookie', cookies)
                .set("Content-Type", "application/json")
                .send({verifyCode: "111111"})
                .end(function (err, res) {
                    res.should.have.status(200);
                    done()
                });
        });
        
        it('/signup/specification', (done) => {
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
        it('/signup/info', (done) => {
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
    
    /**
     * test regitration employee flow
     */
    describe('employee flow', () => {
        
        it('/signup/email', (done) => {
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
        
        it('/signup/verification', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/verification")
                .set('Cookie', cookies)
                .set("Content-Type", "application/json")
                .send({verifyCode: "111111"})
                .end(function (err, res) {
                    res.should.have.status(200);
                    done()
                });
        });
        
        it('/signup/specification', (done) => {
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
                    res.should.have.status(200);
                    done()
                });
        });
        
        it('/signup/info', (done) => {
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
})
;
