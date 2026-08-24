import mongoose, { Schema, Document } from 'mongoose';

export type InteractionType = 'VIEW' | 'FAVORITE' | 'COMPARE' | 'INQUIRY' | 'APPOINTMENT' | 'SEARCH';

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId?: mongoose.Types.ObjectId;
  interactionType: InteractionType;
  dwellTimeSeconds?: number;
  searchQuery?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', index: true },
    interactionType: {
      type: String,
      enum: ['VIEW', 'FAVORITE', 'COMPARE', 'INQUIRY', 'APPOINTMENT', 'SEARCH'],
      required: true,
    },
    dwellTimeSeconds: { type: Number, default: 0 },
    searchQuery: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Interaction = mongoose.model<IInteraction>('Interaction', InteractionSchema);
