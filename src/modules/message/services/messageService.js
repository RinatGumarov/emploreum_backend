const models = require('../../../core/models');
const Messages = models.messages;
const Op = models.sequelize.Op;

const mailSender = require('../utils/mailSender');
const chatService = require('../services/chatService');
const userService = require('../../auth/services/userService');
const employeeService = require('../../employee/services/employeeService');
const companyService = require('../../company/services/companyService');
const notificationService = require('../../message/services/notificationService');
const config = require('../../../utils/config');
const logger = require('../../../utils/logger');

let instance;

class MessageService {
    
    /**
     * рутовый метод для создания сообщений
     * используется в sendToEmployee и
     * sendToCompany
     * @param companyId
     * @param employeeId
     * @param text
     * @param isEmployeeMessage
     * @param isCompanyCessage
     * @returns {Promise<*>}
     */
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
     * от пользователя компании к сотруднику
     */
    async sendToEmployee(userId, employeeId, text) {
        let company = await companyService.findByUserId(userId);
        let user = await userService.getUserByEmployeeId(employeeId);
        notificationService.sendNotification(user.id, "компания отправила вам сообщение");
        let message = await this.save(company.id, employeeId, text, false, true);
        return message;
    }
    
    /**
     * Создание соощение
     * от сотрудника к компании
     */
    async sendToCompany(userId, companyId, text) {
        let employee = await employeeService.getByUserId(userId);
        let user = await userService.getUserByCompanyId(companyId);
        notificationService.sendNotification(user.id, "работник отправил вам сообщение");
        let message = await this.save(companyId, employee.id, text, true, false);
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
    
    async getAllMessageByChatIdAndCompany(chatId, userId) {
        let company = companyService.findByUserId(userId);
        let messages = await this.getAllMessageByChatId(chatId, company.id, null);
        return messages;
    }
    
    async getAllMessageByChatIdAndEmployee(chatId, userId) {
        let employee = await employeeService.getByUserId(userId);
        let messages = await this.getAllMessageByChatId(chatId, null, employee.id);
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

instance = new MessageService();
module.exports = instance;