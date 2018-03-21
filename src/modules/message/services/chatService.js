const models = require('../../../core/models');
const Chats = models.chats;
const Op = models.sequelize.Op;

const mailSender = require('../utils/mailSender');
const queryScanner = require('../../../core/queryScanner');

let instance;

class ChatService {
    
    /**
     * create chat between users
     * @returns {Promise<Model>}
     * @param userIdArray
     */
    async findOrCreate(userIdArray) {
        
        let chat = await Chats.find({
            include: [{
                required: true,
                model: models.users,
                where: {
                    id: {[Op.or]: userIdArray}
                }
            }]
        });
        
        if (!chat) {
            let chat = await Chats.create();
            await chat.addUsers(userIdArray);
        }
        
        return chat;
    }
    
    
    /**
     * получить все чаты где есть этот юзер
     * @param user
     * @returns {Promise<*>}
     */
    async getAllChats(user) {
        let queryStr = queryScanner.message.all_chats;
        let result = await queryScanner.query(queryStr, {
            replacements: {
                userId: user.id
            },
        });
        return result[0];
    }
}

instance = new ChatService();
module.exports = instance;