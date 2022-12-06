const Sequelize = require('sequelize')

const sequelize = new Sequelize ("login", "root@localhost", "", {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize