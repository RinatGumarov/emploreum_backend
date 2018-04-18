'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.renameColumn('answers', "answer", "name");
    },

    down: (queryInterface) => {
        return queryInterface.renameColumn('answers', "name", "answer");
    }
};
