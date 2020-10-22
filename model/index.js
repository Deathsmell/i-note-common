const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    process.env.DATABASE_URL || 'postgres://localhost:5432/note',
    {
        dialect: 'postgres',
    },
)

const syncSequelize = (sync) => {
    sequelize.sync({force: sync})
        .then(() => {
            console.log("Sequelize synced ...")
        })
        .catch(error => {
            console.log("Error",error)
        })
}




const Note = require('./Note')(sequelize, DataTypes);

module.exports = {
    Note,
    sequelize,
    syncSequelize
}