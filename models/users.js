"use strict";
const { Sequelize, Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Posts, {
                targetKey: 'user_id',
                foreignKey: 'user_id'
            })
            this.hasMany(models.Comments, {
                targetKey: 'user_id',
                foreignKey: 'user_id'
            })
            this.hasMany(models.PostsLikes, {
                targetKey: 'user_id',
                foreignKey: 'user_id'
            }),
            this.hasMany(models.PostsScraps, {
                targetKey: 'user_id',
                foreignKey: 'user_id'
            })
        }
    }
    Users.init(
        {
            user_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            user_number: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            nickname: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            age: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            gender: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            category: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn("now"),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn("now"),
            }
        },
        {
            sequelize,
            modelName: "Users",
            timestamps: false,
        }
    );
    return Users;
};
