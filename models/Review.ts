import mongoose from "mongoose"

export interface IReview {
  _id?: string
  external_id: string
  source: "hostaway" | "google" | "airbnb"
  property_id: string
  property_name: string
  guest_name: string
  guest_avatar?: string
  rating: number
  comment: string
  date: Date
  category: string
  channel: string
  response?: string
  response_date?: Date
  is_approved: boolean
  approved_by?: string
  approved_at?: Date
  created_at: Date
  updated_at: Date
}

const ReviewSchema = new mongoose.Schema<IReview>({
  external_id: { type: String, required: true, unique: true },
  source: { type: String, enum: ["hostaway", "google", "airbnb"], required: true },
  property_id: { type: String, required: true },
  property_name: { type: String, required: true },
  guest_name: { type: String, required: true },
  guest_avatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  channel: { type: String, required: true },
  response: { type: String },
  response_date: { type: Date },
  is_approved: { type: Boolean, default: false },
  approved_by: { type: String },
  approved_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

// Create indexes for better query performance
ReviewSchema.index({ external_id: 1 })
ReviewSchema.index({ source: 1 })
ReviewSchema.index({ property_id: 1 })
ReviewSchema.index({ is_approved: 1 })
ReviewSchema.index({ date: -1 })
ReviewSchema.index({ rating: 1 })

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)
