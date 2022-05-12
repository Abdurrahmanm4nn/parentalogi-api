const { Sequelize, sequelize } = require("./baseModel");
const Comments = require("./comments");
const Users = require("./users");

const UserLikesToComment = sequelize.define(
  "user_likes_to_comment",
  {
    id_comment: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: Comments,
        key: "id",
      },
      allowNull: false,
    },
    id_user: {
      type: Sequelize.CHAR(36),
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: Users,
        key: "user_id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
    incrementMe: { type: Sequelize.INTEGER, autoIncrement: false },
    freezeTableName: true,
  }
);

Comments.belongsToMany(Users, { through: UserLikesToComment, unique: false, foreignKey: 'id_comment' });
Users.belongsToMany(Comments, { through: UserLikesToComment, unique: false, foreignKey: 'id_user' });

module.exports = UserLikesToComment;
