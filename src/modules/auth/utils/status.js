const usersService = require('../services/userService');

let instance;

class Status {
    
    /**
     * уввеличивать статус пользователя пока все не заполнит
     * является функцией вызова promise
     * при каком стейте у пользовател должен делаться инкремент
     * для блокирования инкремента при возврате пользователем на шаг назад
     * @param user
     * @returns {Promise<{registrationStep, userId}>}
     */
    async incrementStatusAndReturnResponse(user) {
        user = await usersService.incrementStep(user);
        return {
            registrationStep: user.status,
            userId: user.id
        };
    };
}

instance = new Status();
module.exports = instance;
