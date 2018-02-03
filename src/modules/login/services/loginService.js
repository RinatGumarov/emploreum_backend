const Users = require('../../../core/models').users;
const Op = require('sequelize').Op;

let instance;

class LoginService {

    isEmailFree(email) {
        return Users.findOne({
            where: {
                email: {
                    [Op.eq]: email,
                },
            },
        }).then((user) => user === null);
    }
}

if (typeof instance !== LoginService)
    instance = new LoginService();

module.exports = instance;