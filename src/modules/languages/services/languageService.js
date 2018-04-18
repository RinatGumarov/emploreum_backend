const models = require('../../../core/models');
const Op = models.sequelize.Op;
const Languages = models.languages;

let instance;

class LanguagesService {
    
    async findAll() {
        let languages = await Languages.findAll({
            attributes: ["id","name"],
        });
        return languages;
    }
    
}

instance = new LanguagesService();
module.exports = instance;