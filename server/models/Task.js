const { DataTypes } = require('sequelize');
const { sequelize, dbSchema, isPostgresConfigured } = require('../config/database');

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Task title cannot be empty' },
        len: { args: [1, 255], msg: 'Title must be between 1 and 255 characters' },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'in_progress', 'completed']],
          msg: 'Status must be pending, in_progress, or completed',
        },
      },
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'medium',
      validate: {
        isIn: {
          args: [['low', 'medium', 'high']],
          msg: 'Priority must be low, medium, or high',
        },
      },
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: isPostgresConfigured
          ? { tableName: 'users', schema: dbSchema }
          : 'users',
        key: 'id',
      },
    },
  },
  {
    tableName: 'tasks',
    ...(isPostgresConfigured ? { schema: dbSchema } : {}),
    timestamps: true,
  }
);

module.exports = Task;
