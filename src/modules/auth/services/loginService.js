const models = require('../../../core/models');
const Op = require('sequelize').Op;
const Users = models.users;
const mailSender = require('../utils/mail-sender');
const config = require('../../../utils/config');
const logger = require('../../../utils/logger');

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

    getUserById(id) {
        return Users.findOne(
            {
                where:
                    {id: {
                        [Op.eq]: id
                        }
                    }
            });
    }

    generateCode() {
        let max = 1000000;
        let min = 100000;
        return Math.floor(Math.random() * (max - min + 1)) + min
    }


    saveUser(email, password, role, step) {
        return Users
            .build({
                email: email,
                password: password,
                role: role,
                status: step,
            })
            .save();
    }

    incrementStep(user) {
        return user.increment('status', {by: 1});
    }



}

if (typeof instance !== LoginService)
    instance = new LoginService();

module.exports = instance;