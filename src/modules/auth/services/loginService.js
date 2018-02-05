const models = require('../../../core/models');
const Users = models.users;
const Employees = models.employees;
const Companies = models.companies;
const Cv = models.cvs;
const Profiles = models.profiles;
const Op = require('sequelize').Op;
const Users = models.users;
const mailSender = require('../utils/mail-sender');
const config = require('../../../utils/config');
const logger = require('../../../utils/logger');

let instance;

class LoginService {

    saveEmployeesProfiles(employee, profiles) {
        logger.log(employee);
        Object.keys(profiles).forEach((value, index, array) => {
            Profiles.findOne({
                where: {
                    name: {
                        [Op.eq]: value,
                    },
                },
            }).then((profile) => {
                logger.log(`profile --- ${profile.name}`);
                Cv.build({
                    profile_id: profile.id,
                    employee_id: employee.id,
                }).save().then((cv) => {
                    logger.log(cv);
                })
            })
                .catch((err) => {
                    logger.error(err.message);
                })
        });
        return employee;
    }

    findOrCreateEmployee(user) {
        return Employees.findOrCreate({
            where:{
                user_id: user.id
            },
            defaults: {
                user_id: user.id
            }
        }).then((employee) => {
                return employee[0];
            })
            .catch((err) => {
                logger.log(err.message);
            })
    }

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

}

if (typeof instance !== LoginService)
    instance = new LoginService();

module.exports = instance;