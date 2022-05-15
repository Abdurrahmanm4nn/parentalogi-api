const { Sequelize, sequelize } = require("./baseModel");
const Users = require("./users");
const Tags = require("./tags");

const UserFollowsTag = sequelize.define(
  "user_follows_tag",
  {
    id_user: {
      type: Sequelize.CHAR(36),
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
      references: {
        model: Users,
        key: "user_id",
      },
    },
    id_tag: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
      references: {
        model: Tags,
        key: "id",
      },
    }
  },
  {
    timestamps: false,
    incrementMe: { type: Sequelize.INTEGER, autoIncrement: false },
  }
);

Tags.belongsToMany(Users, { through: UserFollowsTag, unique: false, foreignKey: 'id_tag' });
Users.belongsToMany(Tags, { through: UserFollowsTag, unique: false, foreignKey: 'id_user' });

module.exports = UserFollowsTag;