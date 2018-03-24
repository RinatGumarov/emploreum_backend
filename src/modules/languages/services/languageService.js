const models = require('../../../core/models');
const Op = models.sequelize.Op;
const Languages = models.languages;

let instance;

class LanguagesService {
    
    async findAll() {
        let languages = await Languages.findAll({
            attributes: ["name"],
        });
        return languages;
    }

    async addLanguages(user, languages){
        await user.addLanguages(languages);
    }
    
}

instance = new LanguagesService();
module.exports = instance;