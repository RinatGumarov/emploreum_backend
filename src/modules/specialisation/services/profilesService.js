const models = require('../../../core/models');
const Profiles = models.profiles;
const Op = require('sequelize').Op;

console.log(Profiles);

class ProfileService {

    /**
     * поиск всех профилей
     * @returns {Promise.<Array.<Model>>}
     */
    all(likeStr) {
        let options = {};
        if (typeof likeStr === "string") {
            options.where = {
                name: {
                    [Op.like]: `%${likeStr}%`
                }
            }
        }
        return Profiles.findAll(options);
    }

    /**
     * поиск по имени
     * @param name
     * @returns {Promise.<Model>}
     */
    findOneByName(name) {
        return Profiles.findOne({
            where: {
                name: {
                    [Op.eq]: profileName
                }
            }
        });
    }

}

if (typeof instance !== ProfileService) {
    instance = new ProfileService();
}

module.exports = instance;