const models = require('../../../core/models');
const Messages = models.messages;
const Op = models.sequelize.Op;

const mailSender = require('../utils/mailSender');
const notificationService = require('../../message/services/notificationService');
const chatService = require('./chatService');
const socketSender = require('../../../core/socketSender');

const config = require('../../../utils/config');
const logger = require('../../../utils/logger');

let instance;

class MessageService {
    
    constructor() {
        this.mailConfig = config.get('mail');
    }
    
    /**
     * все сообшения по чату и авторизированному юзеру
     * @param chatId
     * @param user
     * @returns {Promise<*>}
     */
    async getAllMessageByChatId(chatId, user) {
        let options = {
            attributes: [
                "id",
                "text",
                "createdAt",
                "chatId",
                "userId",
                "status"
            ],
            // проверка на то что только авторизированный пользователь
            // может просматривать/обновлять сообшения
            include: [{
                attributes: [],
                include: [{
                    attributes: [],
                    required: true,
                    model: models.users,
                    where: {
                        id: {[Op.eq]: user.id}
                    }
                }],
                required: true,
                model: models.chats,
                where: {
                    id: {[Op.eq]: chatId}
                }
            }],
            where: {
                chatId: {
                    [Op.eq]: chatId
                }
            },
            order: [
                ['createdAt', 'ASC']
            ]
        };
        return await Messages.findAll(options);
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
     * послать сообшение от юзера к юзеру с текстом
     * @param userOwner
     * @param userFrom
     * @param text
     * @returns {Promise<*>}
     */
    async sendMessage(userOwner, userFrom, text) {
        
        let chat = await chatService.findOrCreate([userOwner.id, userFrom.id]);
        let message = await Messages.create({
            userId: userOwner.id,
            text: text,
            chatId: chat.id
        });
        await notificationService.sendNotification(userFrom.id, `вам пришло новое сообшение`);
        await socketSender.sendSocketMessage(`${userFrom.id}:${chat.id}:messages`, message);
        return message;
    }
    
    /**
     * отправит юзером сообшение в чат
     * @param user
     * @param chatId
     * @param text
     * @returns {Promise<void>}
     */
    async sendMessageToChat(user, chatId, text) {
        let chatUsers = await chatService.getChatUsers(chatId);
        let message = await Messages.create({
            userId: user.id,
            text: text,
            chatId: chatId
        });
        
        for (let i = 0; i < chatUsers.length; ++i) {
            if (chatUsers[i].id !== user.id) {
                await notificationService.sendNotification(chatUsers[i].id, `вам пришло новое сообшение`);
                await socketSender.sendSocketMessage(`${chatUsers[i].id}:${chatId}:messages`, message);
            }
        }
        return message;
    }
    
    
    /**
     * @returns {number}
     */
    generateCode() {
        let generate = process.env.MAIL_GENERATE || this.mailConfig.generate;
        let max = 1000000;
        let min = 100000;
        return (generate.toString() === 'true') ? (Math.floor(Math.random() * (max - min + 1)) + min) : 111111;
    }
    
}

instance = new MessageService();
module.exports = instance;