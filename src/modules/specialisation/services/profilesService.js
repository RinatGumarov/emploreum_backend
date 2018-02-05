const Profiles = require('../../../core/models').profiles;

console.log(Profiles);

class ProfileService {

    /**
     * поиск всех профилей
     * @returns {Promise.<Array.<Model>>}
     */
    all() {
        return Profiles.findAll();
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