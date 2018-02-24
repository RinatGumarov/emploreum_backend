const models = require("../../../core/models");
const Tests = models.tests;
const Op = models.sequelize.Op;
const logger = require('../../../utils/logger');

let instance;

class TestService {

    async save(options){
        return await Tests.create(options);
    }

    async addProfileSkills(test, profileSkills){
        return await test.addProfile_skills(profileSkills);
    }


}

if (typeof instance !== TestService) {
    instance = new TestService();
}

module.exports = instance;