import mongoose, { Document, Schema } from 'mongoose';

export interface ILiveReport extends Document {
  studentId: mongoose.Types.ObjectId;
  reportType: 'incident' | 'emergency' | 'observation';
  title: string;
  description: string;
  location?: string;
  createdBy: mongoose.Types.ObjectId;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  witnesses?: string[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const liveReportSchema = new Schema<ILiveReport>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    reportType: {
      type: String,
      enum: ['incident', 'emergency', 'observation'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    status: {
      type: String,
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
