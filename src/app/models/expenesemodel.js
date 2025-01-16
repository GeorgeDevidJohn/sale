import mongoose from "mongoose";

const ExpSchema = new mongoose.Schema(
  {
    expence: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.models.Expense || mongoose.model("Expense", ExpSchema);
