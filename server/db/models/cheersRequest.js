const Sequelize = require('sequelize')
const db = require('../db')

var CheersRequest = db.define('cheersRequest', {
    fulfilledRequest: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = CheersRequest
