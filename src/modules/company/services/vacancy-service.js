const models = require('../../../core/models');
// const  = models.companies;
const CompanyProfiles = models.company_profiles;
const logger = require('../../../utils/logger');
const Op = require('sequelize').Op;
const profilesService = require('../../specialisation/services/profilesService');

let instance;

class CompaniesService {


}

if (typeof instance !== CompaniesService) {
    instance = new CompaniesService();
}

module.exports = instance;