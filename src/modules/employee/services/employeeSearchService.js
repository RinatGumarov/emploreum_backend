const models = require('../../../core/models');
const Employees = models.employees;
const queryScanner = require('../../../core/queryScanner');

let instance;

/**
 * класс работника
 */
class EmployeesSearchService {
    
    async search(params) {
        
        let where = "WHERE ";
        let withAnd = false;
        
        if (params.profileSkills) {
            where += this.getProfileSkillQueryFilter(params.profileSkills);
            withAnd = true;
        }
        
        if (params.languages) {
            where += this.getLanguagesQueryFilter(params.languages, withAnd);
            if (withAnd) {
                withAnd = true;
            }
        }
        
        if (params.city) {
            where += this.getCityQueryFilter(params.city, withAnd);
            if (withAnd) {
                withAnd = true;
            }
        }
        
        if (params.keywords) {
            where += this.getKeywordQueryFilter(params.keywords, withAnd);
            if (withAnd) {
                withAnd = true;
            }
        }
        
        let queryStr = queryScanner.employee.search;
        queryStr = queryStr.replace(':whereQuery', where);
        let employees = await queryScanner.query(queryStr, {
            model: models.employees
        });
        return employees;
    }
    
    getProfileSkillQueryFilter(profileSkills) {
        //добавить начинающие скобки
        let result = "(";
        for (let i = 0; i < profileSkills.length; ++i) {
            let profileSkill = profileSkills[i];
            result += `(cvs.profile_id = ${profileSkill.profileId} AND cv_skills.skill_id = ${profileSkill.skillId})`;
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
            result += `(user_languages.language_id = ${language.id})`;
            if (i !== languages.length - 1) {
                result += " OR ";
            }
        }
        //закрыть начинающие скобки
        result += ")";
        return result;
    }
    
    getCityQueryFilter(city, withAnd) {
        return `${withAnd ? ' AND' : ''} (employees.city LIKE '%${city}%')`;
    }
    
    getKeywordQueryFilter(keywords, withAnd) {
        
        //добавить начинающие скобки
        let result = `${withAnd ? ' AND' : ''}  (`;
        
        for (let i = 0; i < keywords.length; ++i) {
            let keyword = keywords[i];
            result += `((skills.name LIKE '%${keyword}%') OR (employees.about LIKE '%${keyword}%') OR (profiles.name LIKE '%${keyword}%'))`;
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