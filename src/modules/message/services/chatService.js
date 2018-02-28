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
     * @returns {Promise<*>}
     */
    async getAllChatsFroCompany(company) {
        return await company.chats();
    }
    
    /**
     * все чаты у работника
     * @returns {Promise<*>}
     */
    async getAllChatsFroEmployee(employee) {
        return await employee.chats();
    }
    
    /**
     * метод поиска чата между сотрудником и компанией
     * @param employeeId
     * @param companyId
     * @returns {Promise<*>}
     */
    async getChatBetweenEmployeeAndCompany(employeeId, companyId) {
        let chat = await Chats.findOrCreate({
            where: {
                employee_id: employeeId,
                company_id: companyId
            },
            defaults: {
                employee_id: employeeId,
                company_id: companyId
            }
        });
        return chat[0];
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

instance = new ChatService();
module.exports = instance;