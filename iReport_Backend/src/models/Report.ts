import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Student from './Student';

interface ICommentAttributes {
  id?: number;
  userId: number;
  text: string;
  createdAt?: Date;
}

interface IReportAttributes {
  id: number;
  studentId: number;
  reportType: 'academic' | 'behavior' | 'incident' | 'health';
  title: string;
  description: string;
  createdBy: number;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  attachments?: string;
  comments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IReportCreationAttributes extends Optional<IReportAttributes, 'id'> {}

class Report extends Model<IReportAttributes, IReportCreationAttributes> implements IReportAttributes {
  public id!: number;
  public studentId!: number;
  public reportType!: 'academic' | 'behavior' | 'incident' | 'health';
  public title!: string;
  public description!: string;
  public createdBy!: number;
  public priority!: 'low' | 'medium' | 'high';
  public status!: 'open' | 'in_progress' | 'resolved' | 'closed';
  public attachments?: string;
  public comments?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Report.init(
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
      type: DataTypes.ENUM('academic', 'behavior', 'incident', 'health'),
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
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
      defaultValue: 'open',
      allowNull: false,
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
    comments: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue('comments');
        return value ? JSON.parse(value) : [];
      },
      set(value: ICommentAttributes[]) {
        this.setDataValue('comments', JSON.stringify(value || []));
      },
    },
  },
  {
    sequelize,
    tableName: 'reports',
    timestamps: true,
  },
);

export default Report;
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open'
    },
    attachments: [String],
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

export const Report = mongoose.model<IReport>('Report', reportSchema);
