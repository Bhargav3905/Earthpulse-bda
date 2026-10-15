import mongoose from "mongoose";

const earthquakeSchema = new mongoose.Schema(
  {
    usgsId: { type: String, required: true, unique: true },
    magnitude: { type: Number, default: null },
    place: { type: String, default: "Unknown" },
    time: { type: Date, required: true },
    updatedAtSource: { type: Date },
    longitude: Number,
    latitude: Number,
    depth: Number,
    tsunami: { type: Boolean, default: false },
    eventUrl: String,
  },
  { timestamps: true },
);

earthquakeSchema.index({ time: -1 });
earthquakeSchema.index({ magnitude: -1 });

export const Earthquake = mongoose.model("Earthquake", earthquakeSchema);
