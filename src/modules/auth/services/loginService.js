const Users = require('../../../core/models').users;
const Op = require('sequelize').Op;
const mailSender = require('../utils/mail-sender');
const config = require('../../../utils/config');
const logger = require('../../../utils/logger');

let instance;

class LoginService {

    // saveEmployeesProfiles(employee, (profiles))

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

    generateCode() {
        let max = 1000000;
        let min = 100000;
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

}

if (typeof instance !== LoginService)
    instance = new LoginService();

module.exports = instance;