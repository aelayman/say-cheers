const Sequelize = require('sequelize')
const db = require('../db')

var Address = db.define('address', {
    street: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2]
        }
    },
    zip: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [5,9],
            isInt: true
        }
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "USA"

    }
}, {
    getterMethods: {
        fullAddress() {
            return `${this.street}, ${this.city}, ${this.state} ${this.zip}, ${this.country}`
        }
    }
});

module.exports = Address
