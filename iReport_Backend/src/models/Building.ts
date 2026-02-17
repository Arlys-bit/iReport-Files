import mongoose, { Document, Schema } from 'mongoose';

export interface IBuilding extends Document {
  name: string;
  description?: string;
  location?: string;
  rooms: IRoom[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoom {
  name: string;
  roomNumber: string;
  floor: number;
}

const roomSchema = new Schema<IRoom>({
  name: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  }
});

const buildingSchema = new Schema<IBuilding>(
  {
    name: {
      type: String,
      required: true
    },
    description: String,
    location: String,
    rooms: [roomSchema]
  },
  {
    timestamps: true
  }
);

export const Building = mongoose.model<IBuilding>('Building', buildingSchema);
