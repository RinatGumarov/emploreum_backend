'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('vacancy_profile_skills', [
            {
                profile_skill_id: 1,
                vacancy_id: 1
            },
            {
                profile_skill_id: 4,
                vacancy_id: 1
            },
            {
                profile_skill_id: 5,
                vacancy_id: 2
            },
            {
                profile_skill_id: 6,
                vacancy_id: 2
            },
            {
                profile_skill_id: 5,
                vacancy_id: 3
            },
            {
                profile_skill_id: 7,
                vacancy_id: 3
            },
            {
                profile_skill_id: 8,
                vacancy_id: 4
            },
            {
                profile_skill_id: 9,
                vacancy_id: 4
            },
            {
                profile_skill_id: 2,
                vacancy_id: 4
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
