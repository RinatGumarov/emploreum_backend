const chai = require('chai');
const chaiHttp = require('chai-http');
let app = require('../app');

let testIniterInstance;

class TestIniter {
    
    constructor() {
        this.tests = [];
        this.should = chai.should();
        chai.use(chaiHttp);
        this.session = {};
    }
    
    getChaiRequest() {
        return chai.request(app.getServer());
    }
    
    addTestFile(pathToTestFile) {
        this.tests.push(pathToTestFile);
    }
    
    startTests() {
        app.start(false);
        for (let i = 0; i < this.tests.length; ++i) {
            require(this.tests[i]);
        }
    }
    
    setCookie(cookie) {
        this.cookie = cookie;
    }
    
    getCookie() {
        return this.cookie;
    }
    
    setRequestSession(key, value) {
        this.session[key] = value;
    }
    
    getRequestSession(key) {
        return this.session[key];
    }
}

testIniterInstance = new TestIniter();
module.exports = testIniterInstance;