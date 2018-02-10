const models = require('../../../core/models');
const Profiles = models.profiles;
const Skills = models.skills;
const Op = require('sequelize').Op;

let instance;

class SkillService {


    /**
     * поиск скила по профилю
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

    /**
     * поиск по профилю
     * @param name
     * @returns {Promise<Array<Model>>}
     */
    findByProfileName(name) {

        let options = {
            include: [{
                model: Profiles,
                where: {name: {[Op.eq]: name}}
            }]
        };

        return Skills.findAll(options);
    }

    async findByName(name) {
        return await Skills.findOne({
            where: {
                name: {
                    [Op.eq]: name
                }
            }
        });
    }
}

if (typeof instance !== SkillService)
    instance = new SkillService();

module.exports = instance;