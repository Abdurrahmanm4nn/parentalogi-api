const { Sequelize, sequelize } = require("./baseModel");
const Posts = require("./posts");
const Tags = require("./tags");

const PostToTag = sequelize.define('post_to_tag', {
    id_post: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
      references: {
        model: Posts,
        key: "id",
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
    freezeTableName: true,
  }
);

Tags.belongsToMany(Posts, { through: PostToTag, unique: false, foreignKey: 'id_tag' });
Posts.belongsToMany(Tags, { through: PostToTag, unique: false, foreignKey: 'id_post' });

module.exports = PostToTag;