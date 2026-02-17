import mongoose, { Document, Schema } from 'mongoose';
import { hashPassword, comparePassword } from '../utils/password';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'staff';
  phone?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'teacher', 'student', 'staff'],
      default: 'student'
    },
    phone: String,
    profileImage: String
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

userSchema.methods.comparePassword = async function(password: string) {
  return comparePassword(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
