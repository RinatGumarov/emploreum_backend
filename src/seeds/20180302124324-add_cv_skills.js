'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('cv_skills', [
            {
                skill_id: 1,
                cv_id: 1
            },
            {
                skill_id: 2,
                cv_id: 1
            },
            {
                skill_id: 3,
                cv_id: 1
            },
            {
                skill_id: 4,
                cv_id: 1
            }
        ], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
