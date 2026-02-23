import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Student from './Student';

interface ILiveReportAttributes {
  id: number;
  studentId: number;
  reportType: 'incident' | 'emergency' | 'observation';
  title: string;
  description: string;
  location?: string;
  createdBy: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  witnesses?: string;
  attachments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ILiveReportCreationAttributes extends Optional<ILiveReportAttributes, 'id'> {}

class LiveReport extends Model<ILiveReportAttributes, ILiveReportCreationAttributes> implements ILiveReportAttributes {
  public id!: number;
  public studentId!: number;
  public reportType!: 'incident' | 'emergency' | 'observation';
  public title!: string;
  public description!: string;
  public location?: string;
  public createdBy!: number;
  public severity!: 'low' | 'medium' | 'high' | 'critical';
  public status!: 'active' | 'acknowledged' | 'resolved';
  public witnesses?: string;
  public attachments?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

LiveReport.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Student,
        key: 'id',
      },
    },
    reportType: {
      type: DataTypes.ENUM('incident', 'emergency', 'observation'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'acknowledged', 'resolved'),
      defaultValue: 'active',
      allowNull: false,
    },
    witnesses: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue('witnesses');
        return value ? JSON.parse(value) : [];
      },
      set(value: string[]) {
        this.setDataValue('witnesses', JSON.stringify(value || []));
      },
    },
    attachments: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue('attachments');
        return value ? JSON.parse(value) : [];
      },
      set(value: string[]) {
        this.setDataValue('attachments', JSON.stringify(value || []));
      },
    },
  },
  {
    sequelize,
    tableName: 'live_reports',
    timestamps: true,
  },
);

export default LiveReport;
      enum: ['active', 'acknowledged', 'resolved'],
      default: 'active'
    },
    witnesses: [String],
    attachments: [String]
  },
  {
    timestamps: true
  }
);

export const LiveReport = mongoose.model<ILiveReport>('LiveReport', liveReportSchema);
