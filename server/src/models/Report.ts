import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  propertyId: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  reason: string;
  details: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    details: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
