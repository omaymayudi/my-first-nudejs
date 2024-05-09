"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      categories.hasMany(models.Product,{
        foreignKey: "categories_id"
      } )
    }
  }
  categories.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Name must be unique",
        },
        validate: {
          notNull: {
            msg: "Name Tidak beleh kosong",
          },
        },
      },
      description: DataTypes.TEXT,
    },
    {
      hooks: {
        afterValidate: (categories, options) => {
          if (categories.name) {
            categories.name = categories.name.toLowerCase();
          }
        },
      },
      sequelize,
      modelName: "categories",
    }
  );
  return categories;
};
