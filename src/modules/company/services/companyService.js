const models = require('../../../core/models');
const Companies = models.companies;
const CompanyProfiles = models.companyProfiles;
const WorkTransactions = models.workTransactions;
const Works = models.works;
const Tests = models.tests;
const balanceService = require('../../blockchain/services/balanceService');

const Account = require('../../blockchain/utils/account');
const _ = require('lodash');

const Op = models.sequelize.Op;
const Web3InitError = require('../../blockchain/utils/Web3Error');
let instance;

class CompaniesService {
    
    /**
     * создание профиля для компании
     * @param companyId
     * @param profileId
     */
    async addProfileToCompany(companyId, profileId) {
        return await CompanyProfiles.create({
            companyId: companyId,
            profileId: profileId
        });
    }
    
    async save(userId) {
        return (await Companies.findOrCreate({
            where: {
                userId: {
                    [Op.eq]: userId
                }
            },
            defaults: {
                userId: userId
            }
        }))[0];
    }
    
    async update(user, params) {
        return await Companies.update(params, {
            where: {
                userId: {[Op.eq]: user.id}
            }
        });
    }
    
    async findByUserId(userId) {
        return await Companies.findOne({
            where: {
                userId: {
                    [Op.eq]: userId
                }
            },
            include: [models.users]
        });
    }
    
    async findByIdWithUser(id) {
        return await Companies.findOne({
            include: [{
                model: models.users
            }],
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        });
    }
    
    createBlockchainAccountForCompany(companyUser, rating) {
        let blockchainCompany = {
            name: companyUser.company.name,
            rating,
            address: companyUser.accountAddress
        };
        return Account.registerCompany(blockchainCompany).then(async (contract) => {
            if (!contract)
                throw new Web3InitError('Could not register company in blockchain');
            
            companyUser.company.contract = contract.address;
            companyUser.company.save();
            return contract;
        });
    }
    
    async findByVacancyId(vacancyId) {
        return await Companies.findOne({
            include: [{
                attributes: [],
                required: true,
                model: models.vacancies,
                where: {
                    id: {[Op.eq]: vacancyId}
                }
            }, models.users]
        });
    }
    
    async findById(id) {
        return await Companies.findOne({
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        });
    }
    
    async getAll() {
        return await Companies.findAll();
    }
    
    async findAllEmployees(company) {
        let employees = await Works.findAll({
            attributes: [],
            where: {
                companyId: {
                    [Op.eq]: company.id
                }
            },
            include: [{
                attributes: ['photoPath', 'name', 'userId'],
                model: models.employees
            }]
        });
        return _.uniqBy(employees, 'employee.userId');
    }
    
    async findAllTests(companyId) {
        let tests = await Tests.findAll({
            attributes: ['id', 'name'],
            include: [{
                model: models.profileSkills,
                attributes: ['profileId'],
                include: [{
                    model: models.profiles,
                    attributes: ['id', 'name'],
                    include: [{
                        model: models.skills,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: []
                        }
                    }]
                }]
            }],
            where: {
                companyId: {
                    [Op.eq]: companyId
                }
            }
        });
        tests = tests.map((test) => {
            test.dataValues.specifications = [];
            _.uniqBy(test.dataValues.profileSkills, 'profileId')
                .map((specification) => {
                    test.dataValues.specifications.push(specification.profile);
                });
            delete test.dataValues.profile_skills;
            return test;
        });
        return tests;
    }
    
    async findAllActiveContracts(company) {
        let contracts = await Works.findAll({
            where: {
                [Op.and]: {
                    companyId: {
                        [Op.eq]: company.id
                    },
                    status: {
                        [Op.and]: {
                            [Op.gt]: -2,
                            [Op.lt]: 7
                        }
                    }
                }
            },
            include: {
                model: models.vacancies,
                attributes: ['weekPayment']
            }
        });
        return contracts;
    }
    
    async countSpending(contracts) {
        let result = 0;
        let transactionFee = await balanceService.getSalaryFee();
        for (let contract of contracts) {
            result += contract.vacancy.weekPayment;
            result += transactionFee;
        }
        return parseFloat(result.toFixed(10));
    }
    
    async countEmployees(contracts) {
        return await _.uniqBy(contracts, 'employeeId').length;
    }
    
    async getAllTransactions(company) {
        let transactions = await WorkTransactions.findAll({
            include: {
                model: models.works,
                where: {
                    companyId: {
                        [Op.eq]: company.id
                    }
                },
                include: {
                    model: models.employees,
                    attributes: ['name']
                }
            },
            where: {
                transactionHash: {
                    [Op.ne]: null
                }
            }
        });
        return transactions;
    }
}

instance = new CompaniesService();
module.exports = instance;