"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.categories, {
        foreignKey: "categories_id"
      })
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Name must be unique",
        },
        validate: {
          notNull: {
            msg: "Name musht be empty",
          },
        },
      },
      description: DataTypes.STRING,
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: {
            msg: "Price product musht be empty",
          },
        },
      },
      categories_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Categories product musht be empty",
          },
          isInt: true,
          isExist(value) {
            return sequelize.models.categories.findByPk(value).then((data) => {
              if (!data) {
                throw new Error("Categories not found");
              }
            });
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image product musht be empty",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      countReview: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      avgReview: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
