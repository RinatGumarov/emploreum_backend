let instance;

class UserService {
    
    async addLanguages(user, languages){
        await user.addLanguages(languages);
    }

}

if (typeof instance !== UserService) {
    instance = new UserService();
}

module.exports = instance;