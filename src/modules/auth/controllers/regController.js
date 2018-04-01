const usersService = require('../services/userService');
const cvService = require('../../employee/services/cvService');
const employeesService = require('../../employee/services/employeeService');
const userService = require('../../user/services/userService');
const companiesService = require('../../company/services/companyService');
const messageService = require('../../message/services/messageService');

const logger = require('../../../utils/logger');
const account = require('../../blockchain/utils/account');
const web3 = require('../../blockchain/utils/web3');

const FIRST_STATE = 1;
const SECOND_STATE = 2;

module.exports.func = (router) => {


    /**
     * уввеличивать статус пользователя пока все не заполнит
     * является функцией вызова promise
     * @param req
     * @param res
     * @param stateNumber -
     * при каком стейте у пользовател должен делаться инкремент
     * для блокирования инкремента при возврате пользователем на шаг назад
     * @returns {Function}
     */
    incrementStatusAndReturnResponse = async function (req, res) {
        let user = req.user;
        user = await usersService.incrementStep(req.user);
        res.json({
            registrationStep: user.status,
            userId: user.id
        });
    };

    /**
     * шаг регистрации с высыланием проверочного кода на почту
     */
    router.post('/signup/email', async (req, res) => {
        if (!(await usersService.isEmailFree(req.body.email))) {
            res.status(400)
                .json('email is already in use');
        } else {

            if (String(req.body.password) !== String(req.body.passwordConfirmation)) {
                return res.status(400)
                    .json('passwords not equal');
            }

            req.session.email = req.body.email;
            req.session.password = req.body.password;
            req.session.role = req.body.role;
            req.session.verifyCode = messageService.sendCodeToUser(req.body.email);
            res.json({ data: 'success' });

            logger.log(req.session.verifyCode);
        }
    });

    /**
     * шаг проверки высланного кода на почту
     * если пароль верный то регистрируем и аунтифицируем
     * пользователя
     */
    router.post('/signup/verification', async (req, res) => {
        try {
            if (req.session.verifyCode === parseInt(req.body.verifyCode)) {
                let keyPassword = web3.utils.randomHex(32);
                let encryptedKey = JSON.stringify(account.generateAccount(keyPassword));

                let accountAddress = account.decryptAccount(JSON.parse(encryptedKey), keyPassword).address;
                let user = await usersService.saveUser(
                    req.session.email,
                    req.session.password,
                    req.session.role,
                    FIRST_STATE,
                    encryptedKey,
                    keyPassword,
                    accountAddress
                );

                switch (req.session.role) {
                    case 'EMPLOYEE':
                        await employeesService.save(user.id);
                        break;
                    case 'COMPANY':
                        //TODO delete after investors review
                        let company = await companiesService.save(user.id);
                        account.depositFromMain(accountAddress);
                        break;
                }

                req.login(user, (err) => {
                    if (err) {
                        res.status(401)
                            .json({ error: 'Unauthorized' });
                    } else {
                        res.json({
                            registrationStep: user.status,
                            role: req.session.role,
                            userId: req.user.id
                        });
                    }
                });
            } else {
                res.status(400)
                    .json('code mismatch');
            }
        } catch (err) {
            logger.error(err.stack);
            res.status(500)
                .json({
                    error: err.message
                });
        }
    });

    /**
     * Шаг заполнения скилов и профилей компании
     * или работника
     */
    router.post('/signup/specification', async (req, res) => {
        try {
            // profiles - объекты класса профиль, содержащие скиллы.
            let profiles = req.body.specifications;
            switch (req.user.role) {
                case 'EMPLOYEE':
                    for (let i = 0; i < profiles.length; i++) {
                        let cv = await cvService.save(profiles[i], req.user.employee);
                        for (let j = 0; j < profiles[i].skills.length; j++) {
                            await cvService.addSkill(cv, profiles[i].skills[j]);
                        }
                    }
                    break;
                case 'COMPANY':
                    let company = await companiesService.save(req.user.id);
                    for (let i = 0; i < profiles.length; ++i) {
                        await companiesService.addProfileToCompany(company.id, profiles[i].id);
                    }
                    break;
            }
            await incrementStatusAndReturnResponse(req, res);
        } catch (err) {
            logger.error(err.stack);
            res.status(500)
                .json({
                    error: err.message
                });
        }
    });

    /**
     * шаг заполнения лично информации
     */
    router.post('/signup/info', async (req, res) => {
        try {
            switch (req.user.role) {
                case 'EMPLOYEE':
                    //костыль для одной компоненты регистрации
                    req.body.logo = req.body.photoPath;
                    await employeesService.update(req.user.employee, req.body);
                    break;
                case 'COMPANY':
                    await companiesService.update(req.user, req.body);
                    break;
            }
            await userService.addLanguages(req.user, req.body.languages);
            await incrementStatusAndReturnResponse(req, res);
        } catch (err) {
            logger.error(err.stack);
            res.status(500)
                .json({
                    error: err.message
                });
        }
    });

    /**
     * пропустить шаг
     */
    router.get('/signup/skip', async (req, res) => {
        try {
            await incrementStatusAndReturnResponse(req, res);
        } catch (err) {
            logger.error(err.stack);
            res.status(500)
                .json({
                    error: err.message
                });
        }
    });


    /**
     * метод удаления пользователя из системы
     */
    router.delete('/unreg', async (req, res) => {
        if (await usersService.deleteUser(req.user)) {
            res.json({ data: 'success' });
        } else {
            res.status(500)
                .json('server error');
        }
    });

    return router;

};
