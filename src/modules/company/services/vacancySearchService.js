const models = require('../../../core/models');
const queryScanner = require('../../../core/queryScanner');

let instance;

class VacancySearchService {
    
    //toDo
    async search(params) {
        
        let whereQuery = "";
        
        if (params.profileSkills && params.profileSkills.length > 0) {
            whereQuery += this.getProfileSkillQueryFilter(params.profileSkills);
        }
        
        if (params.languages && params.languages.length > 0) {
            whereQuery += this.getLanguagesQueryFilter(params.languages);
        }
        
        if (params.city) {
            whereQuery += this.getCityQueryFilter(params.city);
        }
        
        if (params.keywords && params.keywords.length > 0) {
            whereQuery += this.getKeywordQueryFilter(params.keywords);
        }
        
        let queryStr = queryScanner.company.search;
        queryStr = queryStr.replace(':whereQuery', whereQuery);
        let vacancies = await queryScanner.query(queryStr,  {
            model: models.vacancies
        });
        return vacancies;
    }
    
    getProfileSkillQueryFilter(profileSkills) {
        //добавить начинающие скобки
        let result = "AND (";
        for (let i = 0; i < profileSkills.length; ++i) {
            let profileSkill = profileSkills[i];
            result += `(profile_skills.profile_id = ${profileSkill.profileId} AND profile_skills.skill_id = ${profileSkill.skillId})`;
            if (i !== profileSkills.length - 1) {
                result += " OR ";
            }
        }
        //закрыть начинающие скобки
        result += ")";
        return result;
    }
    
    getLanguagesQueryFilter(languages) {
        
        //добавить начинающие скобки
        let result = 'AND (';
        
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
    
    getCityQueryFilter(city) {
        return `AND(companies.city LIKE '%${city}%')`;
    }
    
    getKeywordQueryFilter(keywords, withAnd) {
        
        //добавить начинающие скобки
        let result = 'AND (';
        
        for (let i = 0; i < keywords.length; ++i) {
            let keyword = keywords[i];
            result += `((skills.name LIKE '%${keyword}%') OR (profiles.name LIKE '%${keyword}%'))`;
            if (i !== keywords.length - 1) {
                result += " OR ";
            }
        }
        //закрыть начинающие скобки
        result += ")";
        return result;
    }
    
    
}

instance = new VacancySearchService();
module.exports = instance;