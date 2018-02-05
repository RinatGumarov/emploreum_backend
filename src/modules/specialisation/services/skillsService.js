const Skills = require('../../../core/models').skills;
const Profiles = require('../../../core/models').profiles;
const Op = require('sequelize').Op;

let instance;

class SkillService {


    findByProfileId(id) {
        return Skills.findAll({
            include: [{
                model: Profiles,
                where: {id: {[Op.eq]: id}}
            }]
        });
    }

}

if (typeof instance !== SkillService)
    instance = new SkillService();

module.exports = instance;