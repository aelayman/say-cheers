const Sequelize = require('sequelize')
const db = require('../db')

var CheersRequest = db.define('cheersRequest', {
    sender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    receiver: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    fulfilledRequest: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = CheersRequest
