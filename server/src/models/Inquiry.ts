import mongoose, { Schema, Document } from 'mongoose';

export type InquiryStatus = 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'CLOSED';

export interface IInquiry extends Document {
  propertyId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  preferredVisitDate?: Date;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    preferredVisitDate: { type: Date },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONTACTED', 'RESOLVED', 'CLOSED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);
