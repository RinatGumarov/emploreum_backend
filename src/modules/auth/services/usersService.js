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
    async isEmailFree(email) {
        let user = await Users.findOne({
            where: {
                email: {
                    [Op.eq]: email,
                },
            },
        });
        return user === null;
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
    async getUserById(id) {
        let user = await Users.findOne({
            include: [{
                model: Roles
            }],
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        });

        return this.changeUserRole(user);
    }

    /**
     * @param email
     * @returns {Promise<Model>}
     */
    async getUserByEmail(email) {
        let user = await Users.findOne({
            include: [{
                model: Roles
            }],
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });
        return this.changeUserRole(user);
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
     * @param user
     * @returns {Promise<*>}
     */
    async incrementStep(user) {
        return await user.increment('status', {by: 1});
    }

    /**
     * @param email
     * @param password
     * @param roleName
     * @param step
     * @returns {Promise<Model>}
     */
    async saveUser(email, password, roleName, step) {
        let role = await rolesService.findByName(roleName);
        let user = await Users.create({
            email: email,
            password: password,
            status: step,
            role_id: role.id
        });
        return user;
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