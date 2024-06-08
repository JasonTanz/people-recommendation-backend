import * as bcrypt from 'bcryptjs';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    university: {
      type: DataTypes.STRING,
    },
    interests: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
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

  Users.associate = function (models) {
    Users.hasMany(models.recommendations, {
      foreignKey: 'userId',
      as: 'user',
    });

    Users.hasMany(models.recommendations, {
      foreignKey: 'recommendedUserId',
      as: 'recommendedUser',
    });
  };
  Users.addHook('beforeCreate', async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });
  Users.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return Users;
};
