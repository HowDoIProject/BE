"use strict";
const { Sequelize, Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Posts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Users, {
                targetKey: 'user_id',
                foreignKey: 'user_id'
            }),
            this.hasMany(models.Comments, {
                targetKey: 'post_id',
                foreignKey: 'post_id'
            }),
            this.hasMany(models.PostsLikes, {
                targetKey: 'post_id',
                foreignKey: 'post_id'
            }),
            this.hasMany(models.PostsScraps, {
                targetKey: 'post_id',
                foreignKey: 'post_id'
            })
        }
    }
    Posts.init(
        {
            post_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            content: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            image: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            category: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            scrap_num: {
                allowNull: true,
                defaultValue: 0,
                type: Sequelize.INTEGER,
            },
            like_num: {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.INTEGER,
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
            },
         },
        {
            sequelize,
            modelName: "Posts",
            timestamps: false,
        }
    );
    return Posts;
};
