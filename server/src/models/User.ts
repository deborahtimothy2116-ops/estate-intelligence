import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'BUYER' | 'AGENT' | 'ADMIN';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  agencyName?: string;
  isVerified: boolean;
  compareList: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['BUYER', 'AGENT', 'ADMIN'], default: 'BUYER' },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    agencyName: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    compareList: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password!);
};

export const User = mongoose.model<IUser>('User', UserSchema);
