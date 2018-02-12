'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('vacancy_profile_skills', [
            {
                profileSkillId: 1,
                vacancy_id: 1
            },
            {
                profileSkillId: 4,
                vacancy_id: 1
            },
            {
                profileSkillId: 5,
                vacancy_id: 2
            },
            {
                profileSkillId: 6,
                vacancy_id: 2
            },
            {
                profileSkillId: 5,
                vacancy_id: 3
            },
            {
                profileSkillId: 7,
                vacancy_id: 3
            },
            {
                profileSkillId: 8,
                vacancy_id: 4
            },
            {
                profileSkillId: 9,
                vacancy_id: 4
            },
            {
                profileSkillId: 2,
                vacancy_id: 4
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
