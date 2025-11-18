// models/Doctor.js
// models/Doctor.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  specialization: { 
    type: String, 
    required: true 
  },
  idProof: {
    type: String, // can be a URL/path to uploaded file or base64 string
    required: true
  }
  // No availability here, since that's a separate collection
});

export default mongoose.model("Doctor", doctorSchema);


