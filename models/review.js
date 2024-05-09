'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Review.init({
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,

      
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User_id musht be empty"
        },
          isExist(value) {
            return sequelize.models.User.findByPk(value).then((data) => {
              if (!data) {
                throw new Error("User_id not found");
              }
            });
          },
        },
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Product_id musht be empty"
        },

          isExist(value) {
            return sequelize.models.Product.findByPk(value).then((data) => {
              if (!data) {
                throw new Error("Product_id not found");
              }
            });
          },
        },
    }, 
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User_id musht be empty"
        },
        min: {
          args: [1],
          msg: "Review points must be more than 1"
        },
        max: {
          args: [1],
          msg: "Review points cannot be more than 5"
        }
    },
  },
    content: {
      type: DataTypes.TEXT
    },
  },
  {
      sequelize,
    modelName: 'Review',
    }
  );
  return Review;
};