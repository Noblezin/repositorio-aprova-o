const Sequelize = require('sequelize')
const sequelize = require('./db')

const Usuario = sequelize.define('usuarios', {
    nome: {
        type: Sequelize.STRING(50)
    },
    email: {
        type: Sequelize.STRING(50)
    },
    senha: {
        type: Sequelize.STRING(70)
    }
})

sequelize.sync({force: false, alter: false})


module.exports = Usuario