import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  studentId: string;
  class: string;
  section: string;
  dateOfBirth?: Date;
  parentEmail?: string;
  parentPhone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentId: {
      type: String,
      required: true,
      unique: true
    },
    class: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    },
    dateOfBirth: Date,
    parentEmail: String,
    parentPhone: String,
    address: String
  },
  {
    timestamps: true
  }
);

export const Student = mongoose.model<IStudent>('Student', studentSchema);
