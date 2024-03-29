"use strict";
const { Sequelize, Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Comments extends Model {
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
    Comments.init(
        {
            comment_id: {
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
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            comment: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            image: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            chosen: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            like_num: {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.INTEGER
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
            modelName: "Comments",
            timestamps: false,
        }
    );
    return Comments;
};
