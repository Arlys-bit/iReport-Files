import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/ireport';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');
    // Sync models with database
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database models synchronized');
  } catch (error) {
    console.error('Database connection failed:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default sequelize;
