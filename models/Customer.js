import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  interests: {
    type: String, // or Array if multiple interests
    required: false,
  },
});

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
