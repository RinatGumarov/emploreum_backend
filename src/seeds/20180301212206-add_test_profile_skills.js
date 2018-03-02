'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('test_profile_skills', [
            {
                test_id: 1,
                profile_skill_id: 1
            },
            {
                test_id: 1,
                profile_skill_id: 2
            }
        ], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
