module.exports = (sequelize, DataTypes) => {
  const Recommendation = sequelize.define('recommendations', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    recommendedUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Recommendation.associate = function (models) {
    Recommendation.belongsTo(models.users, {
      foreignKey: 'userId',
      as: 'user',
    });

    Recommendation.belongsTo(models.users, {
      foreignKey: 'recommendedUserId',
      as: 'recommendedUser',
    });
  };

  return Recommendation;
};
