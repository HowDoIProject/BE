"use strict";
const { Sequelize, Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PostsLikes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Users, {
                targetKey: 'user_id',
                foreignKey: 'user_id',
                onDelete : "CASCADE"
            }),
            this.belongsTo(models.Posts, {
                targetKey: 'post_id',
                foreignKey: 'post_id',
                onDelete : "CASCADE"
            })
        }
    }
    PostsLikes.init(
        {
            like_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            post_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            comment_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
            }
        },
        {
            sequelize,
            modelName: "PostsLikes",
            timestamps: false,
        }
    );
    return PostsLikes;
};
