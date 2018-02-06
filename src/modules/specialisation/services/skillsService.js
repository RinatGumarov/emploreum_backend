const models = require('../../../core/models');
const Skills = models.skills;
const Profiles = models.profiles;
const Op = require('sequelize').Op;

let instance;

class SkillService {


    /** поиск скила по профилю
     * если likestr передан то будет искатьс вхождени в имя
     * @param id
     * @param likeStr
     * @returns {Promise.<Array.<Model>>}
     */
    findByProfileId(id, likeStr) {

        let options = {
            include: [{
                model: Profiles,
                where: {id: {[Op.eq]: id}}
            }]
        };
        
        if (typeof likeStr === "string") {
            options.where = {
                name: {
                    [Op.like]: `%${likeStr}%`
                }
            }
        }

        return Skills.findAll(options);
    }

}

if (typeof instance !== SkillService)
    instance = new SkillService();

module.exports = instance;