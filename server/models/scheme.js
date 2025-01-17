const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // E.g., "Grant", "Loan", "Subsidy", etc.
  amount: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  targetAudience: { type: [String], required: true }, // E.g., ["farmer", "businessman"]
});

const Scheme = mongoose.model('Scheme', schemeSchema);

module.exports = Scheme;
