"use strict";
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      title: DataTypes.STRING,
      body: DataTypes.STRING,
      comment_id: DataTypes.INTEGER,
    },
    {}
  );
  Comment.associate = function (models) {
    models.Comment.belongsTo(models.Post, { as: "post", foreignKey: "id" });
  };
  return Comment;
};
