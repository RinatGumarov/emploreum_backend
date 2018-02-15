const models = require('../../../core/models');
const Chats = models.chats;
const Op = models.sequelize.Op;

const mailSender = require('../utils/mailSender');
let instance;

class ChatService {

    /**
     * Создание чата между
     * сотрудниками и компанией
     * @param companyId
     * @param employeeId
     * @returns {Promise<*>}
     */
    async save(companyId, employeeId) {
        let chat = await Chats.findOrCreate({
            where: {
                company_id: {[Op.eq]: companyId},
                employee_id: {[Op.eq]: employeeId}
            },
            defaults: {
                company_id: companyId,
                employee_id: employeeId
            }
        });
        return chat;
    }

    /**
     * все чаты у компании
     * @param companyId
     * @returns {Promise<*>}
     */
    async getAllChatsFroCompany(companyId) {
        let chats = await Chats.findAll({
            where: {
                company_id: {[Op.eq]: companyId}
            }
        });

        return chats;
    }

    /**
     * все чаты у работника
     * @returns {Promise<*>}
     * @param employeeId
     */
    async getAllChatsFroEmployee(employeeId) {
        let chats = await Chats.findAll({
            where: {
                employee_id: {[Op.eq]: employeeId}
            }
        });

        return chats;
    }

    /**
     * метод поиска чата между сотрудником и компанией
     * @param employeeId
     * @param companyId
     * @returns {Promise<*>}
     */
    async getChatBetweenEmployeeAndCompany(employeeId, companyId) {
        let chat = await Chats.findOne({
            where: {
                employee_id: {[Op.eq]: employeeId},
                company_id: {[Op.eq]: companyId}
            }
        });

        return chat;
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

    async getAllChatWithNewMessage(companyId, employeeId) {
        let includedModel = {
            required: true,
            attributes: [],
            model: models.messages,
            where: {}
        };
        let options = {
            where: {},
        }
        if (companyId) {
            options.where.company_id = {[Op.eq]: companyId};
            options.include = [
                models.employees
            ];
            includedModel.where = {
                is_company_message: false,
                is_employee_message: true,
            }
        }
        if (employeeId) {
            options.where.employee_id = {[Op.eq]: employeeId};
            options.include = [
                models.companies
            ];
            includedModel.where = {
                is_company_message: true,
                is_employee_message: false
            }
        }
        includedModel.where.is_view = false;
        options.include.push(includedModel);

        let chats = await Chats.findAll(options);

        return chats;
    }

    /**
     * все чаты с непрочитаными сообщенияя для компании
     * @param companyId
     * @returns {Promise<*>}
     */
    async getAllChatsWithNewMessageForCompany(companyId) {
        let chats = this.getAllChatWithNewMessage(companyId, null);
        return chats;
    }


    /**
     * все чаты с непрочитаными сообщенияя для работника
     * @param employeeId
     * @returns {Promise<*>}
     */
    async getAllChatsWithNewMessageForEmployee(employeeId) {
        let chats = this.getAllChatWithNewMessage(null, employeeId);
        return chats;
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

}

if (typeof instance !== ChatService) {
    instance = new ChatService();
}

module.exports = instance;