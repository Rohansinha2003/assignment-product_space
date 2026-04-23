const { sequelize, dbSchema, isPostgresConfigured } = require('../config/database');
const User = require('./User');
const Task = require('./Task');

// Associations
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Sync database (alter in dev, never in production without migrations)
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    if (isPostgresConfigured) {
      await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${dbSchema}";`);
      console.log(`✅ PostgreSQL schema ready: ${dbSchema}`);
    }

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synced successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, User, Task, syncDatabase };
