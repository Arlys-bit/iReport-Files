import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  studentId: mongoose.Types.ObjectId;
  reportType: 'academic' | 'behavior' | 'incident' | 'health';
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  attachments?: string[];
  comments?: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const reportSchema = new Schema<IReport>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    reportType: {
      type: String,
      enum: ['academic', 'behavior', 'incident', 'health'],
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
