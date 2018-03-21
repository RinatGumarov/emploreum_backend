const models = require('../../../core/models');
const Op = models.sequelize.Op;
const Users = models.users;
const Roles = models.roles;

const rolesService = require('./roleService');
const employeeService = require('../../employee/services/employeeService');
const companyService = require('../../company/services/companyService');

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
            include: [
                models.roles,
                {
                    required: false,
                    model: models.employees,
                },
                {
                    required: false,
                    model: models.companies,
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
     * toDo переделать на всю обшую информацию из разных таблиц
     * получить информацию о юзере по id
     * @param id
     * @returns {Promise<void>}
     */
    async getNameByUserId(id) {
        let user = await this.getUserById(id);
        let name = null;
        if (user.role = "EMPLOYEE") {
            let employee = employeeService.getByUserId(id);
            return employee.name;
        }
        if (user.role = "COMPANY") {
            let company = companyService.findByUserId(id);
            return company.name;
        }
    }
    
    /**
     * @param email
     * @returns {Promise<Model>}
     */
    async getUserByEmail(email) {
        let user = await Users.findOne({
            include: [
                models.roles,
                {
                    required: false,
                    model: models.employees,
                },
                {
                    required: false,
                    model: models.companies,
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
     * @param status
     * @param encryptedKey
     * @param keyPassword
     * @param accountAddress
     * @returns {Promise<*>}
     */
    async saveUser(email, password, roleName, status, encryptedKey, keyPassword, accountAddress) {
        let roleId = (await rolesService.findByName(roleName)).id;
        let user = await Users.create({
            email,
            password,
            status,
            roleId,
            encryptedKey,
            keyPassword,
            accountAddress
        });
        return user;
    }
    
    
    /**
     * @returns {Promise<T>}
     * @param user
     */
    async deleteUser(user) {
        return await user.destroy();
    }
    
}

instance = new UsersService();
module.exports = instance;