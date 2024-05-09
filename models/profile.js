'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    bio: {
        type: DataTypes.TEXT
      },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "age musht be empty"
        }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Address musht be empty"
        }
      }
    },
    image: {
      type: DataTypes.STRING
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User_id musht be empty"
        }
      },
          isExist(value) {
            return sequelize.models.User.findByPk(value).then((data) => {
              if (!data) {
                throw new Error("Categories not found");
              }
            });
          },
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};