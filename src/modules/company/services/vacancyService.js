const models = require('../../../core/models');
const Vacancies = models.vacancies;
const logger = require('../../../utils/logger');
const Op = require('sequelize').Op;
const Vacancies = models.vacancies;

let instance;

class VacanciesService {

    createVacancy(user, profiles, skills,) {
        return Vacancies.create({
            company_id: user.id,
            name: 'ololo vacancy',
        }).then((vacancy) => {
            logger.log(`created vacancy ${vacancy.name}`);
            return vacancy;
        });
    }

}

if (typeof instance !== VacanciesService) {
    instance = new VacanciesService();
}

module.exports = instance;