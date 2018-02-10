const models = require('../../../core/models');
const Op = require('sequelize').Op;
const Roles = models.roles;

let instance;

class RolesService {

    async findByName(name) {
        let role = await Roles.findOne({where: {role: {[Op.eq]: name}}});
        return role;
    }

}

if (typeof instance !== RolesService)
    instance = new RolesService();

module.exports = instance;