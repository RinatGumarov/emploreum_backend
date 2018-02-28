const models = require('../../../core/models');
const Companies = models.companies;
const CompanyProfiles = models.company_profiles;

const Account = require('../../blockchain/utils/account');
const logger = require('../../../utils/logger');
const _ = require('lodash');

const Op = models.sequelize.Op;
const Web3InitError = require('../../blockchain/utils/Web3Error');
const web3 = require('../../blockchain/utils/web3');
let instance;

class CompaniesService {

    /**
     * создание профиля для компании
     * @param companyId
     * @param profileId
     */
    async addProfileToCompany(companyId, profileId) {
        return await CompanyProfiles.create({
            company_id: companyId,
            profile_id: profileId
        });
    }

    async save(userId) {
        return (await Companies.findOrCreate({
            where: {
                user_id: {
                    [Op.eq]: userId
                }
            },
            defaults: {
                user_id: userId
            }
        }))[0];
    }

    async update(userId, params) {
        return await Companies.update(params, {
            where: {
                user_id: { [Op.eq]: userId }
            }
        });
    }

    async findByUserId(userId) {
        return await Companies.findOne({
            where: {
                user_id: {
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

    async hasContracts(companyId) {
        let works = await models.works.find({
            where: {
                company_id: {
                    [Op.eq]: companyId
                }
            }
        });
        return works !== null;
    }

    createBlockchainAccountForCompany(company, rating) {
        let blockchainCompany = {
            name: company.name,
            rating,
            address: company.user.account_address
        };
        return Account.registerCompany(blockchainCompany).then(async (contract) => {
            if (!contract)
                throw new Web3InitError('Could not register company in blockchain');

            company.contract = contract.address;
            company.save();
            return contract;
        });
    }

    async findByVacancyId(vacancyId) {
        return await Companies.findOne({
            include: [models.users, {
                attributes: [],
                required: true,
                model: models.vacancies,
                where: {
                    id: { [Op.eq]: vacancyId }
                }
            }]
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

    async findAllEmployees(companyId) {
        let employees = await models.works.findAll({
            attributes: [],
            distinct: 'company_id',
            where: {
                company_id: {
                    [Op.eq]: companyId
                }
            },
            include: [{
                attributes: ['photo_path', 'name', 'user_id'],
                model: models.employees
            }]
        });
        return _.uniqBy(employees, 'employee.user_id');
    }

    async findAllTests(companyId) {
        let tests = await models.tests.findAll({
            attributes: ['id', 'name'],
            include: [{
                model: models.profile_skills,
                attributes: ['profile_id'],
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
                company_id: {
                    [Op.eq]: companyId
                }
            }
        });
        tests = tests.map((test) => {
            test.dataValues.specifications = [];
            _.uniqBy(test.dataValues.profile_skills, 'profile_id')
                .map((specification) => {
                    test.dataValues.specifications.push(specification.profile);
                });
            delete test.dataValues.profile_skills;
            return test;
        });
        return tests;
    }

    async findAllActiveContracts(company) {
        let contracts = await models.works.findAll({
            where: {
                [Op.and]: {
                    company_id: {
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
                attributes: ['week_payment']
            }
        });
        return contracts;
    }

    async countSpending(contracts) {
        let result = 0;
        for (let contract of contracts) {
            result += contract.vacancy.week_payment;
        }
        return parseFloat(result.toFixed(10));
    }

    async countEmployees(contracts) {
        return await _.uniqBy(contracts, 'employeeId').length;
    }

    async getAllTransactions(company) {
        let transactions = await models.work_transactions.findAll({
            include: {
                model: models.works,
                where: {
                    company_id: {
                        [Op.eq]: company.id,
                    }
                },
                include: {
                    model: models.employees,
                    attributes: ["name"],
                }
            },
            where: {
                transaction_hash: {
                    [Op.ne]: null,
                }
            }
        });
        return transactions;
    }
}

instance = new CompaniesService();
module.exports = instance;