const models = require('../../../core/models');
const Messages = models.messages;
const Op = models.sequelize.Op;

const mailSender = require('../utils/mailSender');
const chatService = require('../services/chatService');
const config = require('../../../utils/config');
const logger = require('../../../utils/logger');

let instance;

class MessageService {

    async save(companyId, employeeId, text, isEmployeeMessage, isCompanyCessage) {

        let chat = await chatService.getChatBetweenEmployeeAndCompany(employeeId, companyId);

        let message = await Messages.create({
            chat_id: chat.id,
            text: text,
            is_employee_message: isEmployeeMessage,
            is_company_message: isCompanyCessage
        });

        return message;
    }

    /**
     * Создание соощение
     * от компании к сотруднику
     */
    async sendToEmployee(companyId, employeeId, text) {
        let message = await this.save(companyId, employeeId, text, false, true);
        return message;
    }

    /**
     * Создание соощение
     * от сотрудника к компании
     */
    async sendToCompany(companyId, employeeId, text) {
        let message = await this.save(companyId, employeeId, text, true, false);
        return message;
    }


    async getAllMessageByChatId(chatId, companyId, employeeId) {
        let includedModel = {
            required: true,
            attributes: [],
            where: {
                id: {[Op.eq]: chatId}
            },
            model: models.chats
        };
        if (companyId) {
            includedModel.where.company_id = {[Op.eq]: companyId};
        }
        if (employeeId) {
            includedModel.where.company_id = {[Op.eq]: companyId};
        }
        let messages = await Messages.findAll({
            include: [includedModel],
            order: [
                ['created_at', 'ASC']
            ]
        });

        return messages;
    }

    async getAllMessageByChatIdAndCompanyId(chatId, companyId) {
        let messages = await this.getAllMessageByChatId(chatId, companyId, null);
        return messages;
    }

    async getAllMessageByChatIdAndEmployeeId(chatId, employeeId) {
        let messages = await this.getAllMessageByChatId(chatId, null, employeeId);
        return messages;
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
     * @returns {number}
     */
    generateCode() {
        let max = 1000000;
        let min = 100000;
        return 111111;
        // return Math.floor(Math.random() * (max - min + 1)) + min
    }

}

if (typeof instance !== MessageService) {
    instance = new MessageService();
}

module.exports = instance;