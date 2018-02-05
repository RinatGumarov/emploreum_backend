'use strict';

module.exports = {

    async up(queryInterface, Sequelize) {


        return queryInterface.bulkInsert('profile_skills', [
            {
                profile_id: await queryInterface.rawSelect('profiles', {where: {name: 'web'}}, ['id']),
                skill_id: await queryInterface.rawSelect('skills', {where: {name: 'postgres'}}, ['id'])
            },
            {
                profile_id: await queryInterface.rawSelect('profiles', {where: {name: 'web'}}, ['id']),
                skill_id: await queryInterface.rawSelect('skills', {where: {name: 'javascript'}}, ['id'])
            },
            {
                profile_id: await queryInterface.rawSelect('profiles', {where: {name: 'desktop'}}, ['id']),
                skill_id: await queryInterface.rawSelect('skills', {where: {name: 'postgres'}}, ['id'])
            },
            {
                profile_id: await queryInterface.rawSelect('profiles', {where: {name: 'desktop'}}, ['id']),
                skill_id: await queryInterface.rawSelect('skills', {where: {name: 'java'}}, ['id'])
            },
            {
                profile_id: await queryInterface.rawSelect('profiles', {where: {name: 'mobile'}}, ['id']),
                skill_id: await queryInterface.rawSelect('skills', {where: {name: 'postgres'}}, ['id'])
            },
            {
                profile_id: await queryInterface.rawSelect('profiles', {where: {name: 'mobile'}}, ['id']),
                skill_id: await queryInterface.rawSelect('skills', {where: {name: 'java'}}, ['id'])
            }
        ], {});


    },

    down: (queryInterface, Sequelize) => {
    }
};
