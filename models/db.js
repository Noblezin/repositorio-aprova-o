const Sequelize = require('sequelize')

const sequelize = new Sequelize ("login", "root", "", {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize