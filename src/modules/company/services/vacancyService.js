const models = require('../../../core/models');
const Vacancies = models.vacancies;
const logger = require('../../../utils/logger');
const Op = require('sequelize').Op;

let instance;

class VacanciesService {

    createVacancy(user, options){
        return Vacancies.build({

        }).save();
    }

}

if (typeof instance !== VacanciesService) {
    instance = new VacanciesService();
}

module.exports = instance;