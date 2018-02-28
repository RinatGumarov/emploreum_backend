const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');
require("../modules");
app.start(false);

let testIniterInstance;

class TestIniter {
    
    constructor() {
        this.companyCredentials = {
            email: "a@a.ru",
            password: "1"
        };
        this.should = chai.should();
        chai.use(chaiHttp);
    }
    
    getChaiRequest() {
        return chai.request(app.getServer());
    }
    
    
}

testIniterInstance = new TestIniter();
module.exports = testIniterInstance;