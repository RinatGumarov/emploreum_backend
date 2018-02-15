const models = require('../../../core/models');
const Vacancies = models.vacancies;
const Companies = models.companies;
const ProfileSkills = models.profile_skills;
const VacancyProfileSkills = models.vacancy_profile_skills;

const queryScanner = require('../../../core/queryScanner');
const employeeService = require('../../employee/services/employeeService');
const Op = models.sequelize.Op;

let instance;

class VacanciesService {

    async save(params) {
        return await Vacancies.create(params);
    }

    async findProfileSkill(profileId, skillId) {
        return await ProfileSkills.findOne({
            where: {
                profile_id: {
                    [Op.eq]: profileId,
                },
                skill_id: {
                    [Op.eq]: skillId,
                }
            }
        });
    }

    async addProfileSkillToVacancy(options) {
        return await VacancyProfileSkills.create(
            options
        )
    }


    async findAll(companyId) {

        let option = {
            include: [{
                model: models.profile_skills,
                through: {attributes: []},
                include: [models.profiles, models.skills]
            }],
            where: {}
        };

        if (companyId) {
            option.where.company_id = {
                [Op.eq]: companyId,
            }
        }

        // преобразовыываем в нормалььный вид
        let vacancies = await Vacancies.findAll(option);
        let resultVacancies = [];

        //toDo изменить когда будет времечко
        // преобразовывем в человечиский вид)
        for (let i = 0; vacancies.length && i < vacancies.length; ++i) {

            let vacancy = vacancies[i];
            vacancy.dataValues.profiles = [];

            let existProfiles = [];
            let existSkillFromProfiles = [];

            for (let j = 0; vacancy.profile_skills.length && j < vacancy.profile_skills.length; j++) {

                let profileSkill = vacancy.profile_skills[j];
                let profileId = profileSkill.profile_id;
                let skillId = profileSkill.skill_id;
                let index;

                if (!existProfiles.includes(profileId)) {
                    //записываем что профиль уже добавлен
                    existProfiles.push(profileId);
                    // создаем место под запимсь добавленых скилов в даннм профиле
                    existSkillFromProfiles[profileId] = [];
                    // ищме его индекс в существующих профилях
                    index = existProfiles.indexOf(profileId);
                    // и добоавляем профиль в реальную вакансию по индексу
                    // (при json encode числовые индексы не учитываются)
                    vacancy.dataValues.profiles[index] = profileSkill.profile;
                    // создаем массив скилов в профиле
                    vacancy.dataValues.profiles[index].dataValues.skills = [];
                } else {
                    // если уже существует профиль то просто ищем его
                    index = existProfiles.indexOf(profileId);
                }

                //проверяем существует ли данный скил уже в профилем
                // если нет то добавляем
                if (!existSkillFromProfiles[profileId].includes(skillId)) {
                    existSkillFromProfiles[profileId].push(skillId);
                    vacancy.dataValues.profiles[index].dataValues.skills.push(profileSkill.skill)
                }

            }

            delete vacancy.dataValues.profile_skills;

            resultVacancies.push(vacancy);
        }

        return resultVacancies;

    }

    /**
     * //toDo
     * метод получения рекомендуемых вакансий по профилю работника
     * Добавить обработку в скрипте array_positions
     * для выявления сходства направления скила работника и направления
     * скила вакансии
     * @param skills
     * @param userId
     * @returns {Promise<*>}
     */
    async getRecommended(skills, userId) {
        let employee = await employeeService.getByUserId(userId);
        let employeeId = employee.id;
        let skillsIds = skills.map((skill) => {
            return skill.id
        });

        let queryStr = queryScanner.company.recommended_vacancies;
        let vacancies = await models.sequelize.query(queryStr,
            {
                replacements: {
                    skillsString: skillsIds.join(","),
                    employeeId: employeeId,
                },
                type: models.sequelize.QueryTypes.SELECT,
                model: Vacancies
            });

        return vacancies;
    }

    async findById(id){
        return await Vacancies.findById(id);
    }
}

if (typeof instance !== VacanciesService) {
    instance = new VacanciesService();
}

module.exports = instance;