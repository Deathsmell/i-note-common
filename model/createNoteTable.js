const TABLE_NAME = 'notes';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE_NAME,{
            id:{
                allowNull : false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            width:{
                allowNull: false,
                type: Sequelize.INTEGER
            },
            height:{
                allowNull:false,
                type: Sequelize.INTEGER
            },
            x:{
                allowNull:false,
                type: Sequelize.INTEGER
            },
            y:{
                allowNull:false,
                type: Sequelize.INTEGER
            },
            text:{
                allowNull:true,
                type: Sequelize.STRING
            },
            color:{
                allowNull:true,
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.STRING,
                allowNull: true
            },
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(TABLE_NAME)
    }
}