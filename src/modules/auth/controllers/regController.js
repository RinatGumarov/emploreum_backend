const usersService = require('../services/userService');
const cvService = require('../../employee/services/cvService');
const employeesService = require('../../employee/services/employeeService');
const companiesService = require('../../company/services/companyService');
const logger = require('../../../utils/logger');

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
    incrementStatusAndReturnResponse = async function (req, res, stateNumber) {
        let user = req.user;
        if (user.status === stateNumber) {
            user = await usersService.incrementStep(req.user);
        }
        return res.json({
            registrationStep: user.status,
        });
    };

    /**
     * шаг регистрации с высыланием проверочного кода на почту
     */
    router.post('/signup/1', async (req, res) => {
        if (!(await usersService.isEmailFree(req.body.email))) {
            return res.status(400).send('email is already in use');
        } else {

            if (String(req.body.password) !== String(req.body.passwordConfirmation)) {
                return res.status(400).send("passwords not equal");
            }

            req.session.email = req.body.email;
            req.session.password = req.body.password;
            req.session.role = req.body.role;
            req.session.verifyCode = usersService.sendCodeToUser(req.body.email);
            res.json({data: "success"});

            logger.log(req.session.verifyCode);
        }
    });

    /**
     * шаг проверки высланного кода на почту
     * если пароль верный то регистрируем и аунтифицируем
     * пользователя
     */
    router.post('/signup/2', async (req, res) => {
        try {
            if (req.session.verifyCode === parseInt(req.body.verifyCode)) {
                let user = await usersService.saveUser(
                    req.session.email,
                    req.session.password,
                    req.session.role,
                    FIRST_STATE
                );
                req.login(user, (err) => {
                    if (err) {
                        return res.status(401).send({
                            error: 'Unauthorized'
                        });
                    } else {
                        return res.send({
                            registrationStep: user.status,
                            role: req.session.role
                        });
                    }
                });
            } else {
                return res.status(400).send('code mismatch')
            }
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).json({
                error: err.message
            })
        }
    });

    /**
     * Шаг заполнения скилов и профилей компании
     * или работника
     */
    router.post('/signup/3', async (req, res) => {
        try {
            // profiles - объекты класса профиль, содержащие скиллы.
            let profiles = req.body.profiles;
            switch (req.user.role) {
                case 'EMPLOYEE':
                    let employee = await employeesService.save(req.user.id);
                    for (let i = 0; i < profiles.length; i++) {
                        let profile = profiles[i];
                        let cv = await cvService.save(profile.id, employee.id);
                        let skills = profile.skills;
                        // сохраняем скилы
                        for (let j = 0; j < skills.length; j++) {
                            cvService.addSkill(cv, skills[j].id)
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
            await incrementStatusAndReturnResponse(req, res, FIRST_STATE);
        } catch (err) {
            logger.error(err);
            res.status(500).json({
                error: err.message
            });
        }
    });

    /**
     * шаг заполнения лично информации
     */
    router.post('/signup/4', async (req, res) => {
        try {
            switch (req.user.role) {
                case 'EMPLOYEE':
                    await employeesService.update(req.user.id, req.body);
                    break;
                case 'COMPANY':
                    await companiesService.update(req.user.id, req.body);
                    break;
            }
            await incrementStatusAndReturnResponse(req, res, SECOND_STATE);
        } catch (err) {
            res.status(500).json({
                error: err.message
            })
        }
    });

    /**
     * метод удаления пользователя из системы
     */
    router.delete('/unreg', async (req, res) => {
        if (await usersService.deleteUser(req.user.id)) {
            return res.json({data: "success"});
        } else {
            return res.status(500).send('server error');
        }
    });

    return router;

};
