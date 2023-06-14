"use strict";
const { Sequelize, Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Categories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Users, {
                targetKey: "category",
                foreignKey: "category",
            });
        }
    }
    Categories.init(
        {
            category: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            category_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        },
        {
            sequelize,
            modelName: "Categories",
            timestamps: false,
        }
    );
    return Categories;
};
