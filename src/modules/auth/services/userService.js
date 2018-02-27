const models = require('../../../core/models');
const Op = models.sequelize.Op;
const Users = models.users;
const Roles = models.roles;

const rolesService = require('./roleService');

let instance;

class UsersService {
    
    async getUserByCompanyId(companyId) {
        let user = await Users.findOne({
            include: [{
                required: true,
                attributes: [],
                model: models.companies,
                where: {
                    id: {
                        [Op.eq]: companyId
                    }
                }
            }]
        });
        
        return user;
    }
    
    async getUserByEmployeeId(employeeId) {
        let user = await Users.findOne({
            include: [{
                required: true,
                attributes: [],
                model: models.employees,
                where: {
                    id: {
                        [Op.eq]: employeeId
                    }
                }
            }]
        });
        
        return user;
    }
    
    /**
     * @param email
     * @returns {Promise<boolean>}
     */
    async isEmailFree(email) {
        let user = await Users.findOne({
            where: {
                email: {
                    [Op.eq]: email,
                },
            },
        });
        return user === null;
    }
    
    /**
     * @param id
     * @returns {Promise<Model>}
     */
    async getUserById(id) {
        let user = await Users.findOne({
            include: [{
                model: Roles
            }],
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        });
        
        return this.changeUserRole(user);
    }
    
    /**
     * @param email
     * @returns {Promise<Model>}
     */
    async getUserByEmail(email) {
        let user = await Users.findOne({
            include: [{
                model: Roles
            }],
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });
        return this.changeUserRole(user);
    }
    
    /**
     * Трансформирует роль в нормальный вид
     * @param user
     * @returns {*}
     */
    changeUserRole(user) {
        if (user) {
            user.role = user.role.role;
        }
        return user;
    }
    
    /**
     * @param user
     * @returns {Promise<*>}
     */
    async incrementStep(user) {
        return await user.increment('status', {by: 1});
    }
    
    /**
     * @param email
     * @param password
     * @param roleName
     * @param step
     * @returns {Promise<Model>}
     */
    async saveUser(email, password, roleName, status, encrypted_key, key_password, account_address) {
        let role_id = (await rolesService.findByName(roleName)).id;
        let user = await Users.create({
            email,
            password,
            status,
            role_id,
            encrypted_key,
            key_password,
            account_address
        });
        return user;
    }
    
    
    /**
     * @param user
     * @returns {Promise<T>}
     */
    async deleteUser(userId) {
        return await Users.destroy({
            where: {
                id: {
                    [Op.eq]: userId,
                },
            }
        });
    }
    
    async destroySession(sessionId){
        await models.session
    }

}

instance = new UsersService();
module.exports = instance;