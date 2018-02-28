let testIniter = require('../../../../core/testIniter');
var cookies;

describe('reg', () => {
    
    /**
     * test regitration company flow
     */
    describe('company', () => {
        
        
        it('email send', (done) => {
            testIniter.getChaiRequest()
                .post("/auth/signup/email")
                .set("Content-Type", "application/json")
                .send({
                    email: "mikl778890@yandex.ru",
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
                    done()
                });
        });
        
    });
    
});