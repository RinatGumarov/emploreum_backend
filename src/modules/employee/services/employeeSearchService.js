const models = require('../../../core/models');
const queryScanner = require('../../../core/queryScanner');

let instance;

/**
 * класс работника
 */
class EmployeesSearchService {
    
    async search(params) {
        
        let where = "WHERE ";
        let withAnd = false;
        let withWhereParams = false;
        
        if (params.profileSkills && params.profileSkills.length > 0) {
            where += this.getProfileSkillQueryFilter(params.profileSkills);
            withAnd = true;
            withWhereParams = true;
        }
        
        if (params.languages && params.languages.length > 0) {
            where += this.getLanguagesQueryFilter(params.languages, withAnd);
            withAnd = true;
            withWhereParams = true;
        }
        
        if (params.city) {
            where += this.getCityQueryFilter(params.city, withAnd);
            withAnd = true;
            withWhereParams = true;
        }
        
        if (params.keywords && params.keywords.length > 0) {
            where += this.getKeywordQueryFilter(params.keywords, withAnd);
            withAnd = true;
            withWhereParams = true;
        }
        
        let queryStr = queryScanner.employee.search;
        if (withWhereParams === true) {
            queryStr = queryStr.replace(':whereQuery', where);
        } else {
            queryStr = queryStr.replace(':whereQuery', "");
        }
        
        let employees = await queryScanner.query(queryStr, {
            model: models.employees,
            include: [{
                model: models.cvs,
                attributes: ['id'],
                include: [
                    {
                        model: models.profiles,
                        attributes: ['name']
                    },
                    {
                        model: models.skills,
                        attributes: ['name']
                    }
                ]
            }, {
                model: models.works,
                attributes: ['id'],
                include: [{
                    model: models.companies,
                    attributes: ['name']
                }, {
                    model: models.vacancies,
                    attributes: ['name']
                }]
            }]
        });
        return employees;
    }
    
    getProfileSkillQueryFilter(profileSkills) {
        //добавить начинающие скобки
        let result = "(";
        for (let i = 0; i < profileSkills.length; ++i) {
            let profileSkill = profileSkills[i];
            result += `("cvs"."profile_id" = ${profileSkill.profileId} AND "cvs->skills->cv_skills"."skill_id"= ${profileSkill.skillId})`;
            if (i !== profileSkills.length - 1) {
                result += " OR ";
            }
        }
        //закрыть начинающие скобки
        result += ")";
        return result;
    }
    
    getLanguagesQueryFilter(languages, withAnd) {
        
        //добавить начинающие скобки
        let result = `${withAnd ? ' AND' : ''}  (`;
        
        for (let i = 0; i < languages.length; ++i) {
            let language = languages[i];
            result += `("user->languages->user_languages"."language_id" = ${language.id})`;
            if (i !== languages.length - 1) {
                result += " OR ";
            }
        }
        //закрыть начинающие скобки
        result += ")";
        return result;
    }
    
    getCityQueryFilter(city, withAnd) {
        return `${withAnd ? ' AND' : ''} ("employees"."city" LIKE '%${city}%')`;
    }
    
    getKeywordQueryFilter(keywords, withAnd) {
        
        //добавить начинающие скобки
        let result = `${withAnd ? ' AND' : ''}  (`;
        
        for (let i = 0; i < keywords.length; ++i) {
            let keyword = keywords[i];
            result += `(("cvs->skills"."name" LIKE '%${keyword}%') OR ("employees"."about" LIKE '%${keyword}%') OR ("cvs->profile"."name" LIKE '%${keyword}%'))`;
            if (i !== keywords.length - 1) {
                result += " OR ";
            }
        }
        //закрыть начинающие скобки
        result += ")";
        return result;
    }
    
}

instance = new EmployeesSearchService();
module.exports = instance;