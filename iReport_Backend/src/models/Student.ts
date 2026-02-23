import { DataTypes, Model, Optional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface IStudentAttributes {
  id: number;
  userId: number;
  studentId: string;
  class: string;
  section: string;
  dateOfBirth?: Date;
  parentEmail?: string;
  parentPhone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IStudentCreationAttributes extends Optional<IStudentAttributes, 'id'> {}

class Student extends Model<IStudentAttributes, IStudentCreationAttributes> implements IStudentAttributes {
  public id!: number;
  public userId!: number;
  public studentId!: string;
  public class!: string;
  public section!: string;
  public dateOfBirth?: Date;
  public parentEmail?: string;
  public parentPhone?: string;
  public address?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    parentEmail: {
      type: DataTypes.STRING,
    },
    parentPhone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'students',
    timestamps: true,
  },
);

export default Student;
