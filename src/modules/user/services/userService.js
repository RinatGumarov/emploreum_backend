let instance;

class UserService {
    
    async addLanguages(user, languages) {
        await user.addLanguages(languages);
    }
    
    async allLanguages(user) {
        let languages = await user.getLanguages();
        if (languages.length === 0) {
            return [];
        }
        return languages;
    }
    
}

if (typeof instance !== UserService) {
    instance = new UserService();
}

module.exports = instance;