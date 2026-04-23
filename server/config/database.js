const { Sequelize } = require('sequelize');
const path = require('path');

const isPostgresConfigured = Boolean(process.env.DB_HOST);
const dbSchema = process.env.DB_SCHEMA || 'public';

let sequelize;

if (isPostgresConfigured) {
  // PostgreSQL (production / when configured)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    }
  );
} else {
  // SQLite fallback for local development (no PostgreSQL needed)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false,
  });
}

module.exports = { sequelize, dbSchema, isPostgresConfigured };
