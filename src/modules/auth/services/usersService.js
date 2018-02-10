const models = require('../../../core/models');
const Op = require('sequelize').Op;
const Users = models.users;
const Roles = models.roles;
const rolesService = require('./rolesService');
const mailSender = require('../utils/mail-sender');
const config = require('../../../utils/config');
const logger = require('../../../utils/logger');

let instance;

class UsersService {

    /**
     * @param email
     * @returns {Promise<boolean>}
     */
    isEmailFree(email) {
        return Users.findOne({
            where: {
                email: {
                    [Op.eq]: email,
                },
            },
        }).then((user) => user === null);
    }

    /**
     * @param email
     * @returns {number}
     */
    sendCodeToUser(email) {
        const code = this.generateCode();

        const mailOptions = {
            from: `${config.get('smtp')}`,
            to: `${email}`,
            subject: 'Verify email address',
            text: `Your code is ${code}`
        };

        mailSender.sendEmail(mailOptions, (error, info) => {
            if (error) {
                logger.log(error);
            } else {
                logger.log('Email sent: ' + info.response);
            }
        });
        return code;
    }

    /**
     * @param id
     * @returns {Promise<Model>}
     */
    getUserById(id) {
        return Users.findOne({
            include: [{
                model: Roles
            }],
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        }).then(function (user) {
            return instance.changeUserRole(user);
        });
    }

    /**
     * @param email
     * @returns {Promise<Model>}
     */
    getUserByEmail(email) {
        return Users.findOne({
            include: [{
                model: Roles
            }],
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        }).then(function (user) {
            return instance.changeUserRole(user);
        });
    }

    /**
     * Трансформирует роль в нормальный вид
     * @param user
     * @returns {*}
     */
    changeUserRole(user) {
        if (user) {
            user.role = user.role.role;
        }
        return user;
    }

    /**
     * @returns {number}
     */
    generateCode() {
        let max = 1000000;
        let min = 100000;
        return 111111;
        // return Math.floor(Math.random() * (max - min + 1)) + min
    }


    /**
     * увеличивает статус пользователя
     * при регистрации
     * @param user
     * @returns {Promise<this>|*|void}
     */
    incrementStep(user) {
        return user.increment('status', {by: 1});
    }

    /**
     * @param email
     * @param password
     * @param roleName
     * @param step
     * @returns {Promise<Model>}
     */
    saveUser(email, password, roleName, step) {
        return rolesService.findByName(roleName).then((role) => {
            let user = {
                email: email,
                password: password,
                status: step,
                role_id: role.id
            };
            return Users.create(user);
        });
    }


    /**
     * @param user
     * @returns {Promise<T>}
     */
    deleteUser(user) {
        return Users.destroy({
            where: {
                id: {
                    [Op.eq]: user.id,
                },
            },
            force: false,
            cascade: true
        }).then((deletedRows) => {
            if (deletedRows === 1) {
                logger.log(`user ${user.email} deleted successfully`);
                return true;
            }
            else {
                logger.error('something went wrong');
                return false;
            }
        }).catch((err) => {
            logger.error(err);
            return false;
        });
    }


}

if (typeof instance !== UsersService)
    instance = new UsersService();

module.exports = instance;