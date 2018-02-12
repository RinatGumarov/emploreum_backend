'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('profile_skills', [
            {
                profileSkillId: await queryInterface.rawSelect('profile_skills', {
                    where: {
                        profile_id: await queryInterface.rawSelect('profiles', {where: {name: 'postgres'}}, ['id'])
                    }
                }, ['id']),
                vacancy_id: 1
            },
            {
                profileSkillId: await queryInterface.rawSelect('profile_skils', {
                    where: {
                        profile_id: await queryInterface.rawSelect('profiles', {where: {name: 'java'}}, ['id'])
                    }
                }, ['id']),
                vacancy_id: 1
            },
            {
                profileSkillId: await queryInterface.rawSelect('profile_skils', {
                    where: {
                        profile_id: await queryInterface.rawSelect('profiles', {where: {name: 'postgres'}}, ['id'])
                    }
                }, ['id']),
                vacancy_id: 3
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
