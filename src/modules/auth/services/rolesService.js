const models = require('../../../core/models');
const Op = require('sequelize').Op;
const Roles = models.roles;

let instance;

class RolesService {

    findByName(name) {

        let options = {
            where: {role: {[Op.eq]: name}}
        };

        return Roles.findOne(options);
    }

}

if (typeof instance !== RolesService)
    instance = new RolesService();

module.exports = instance;