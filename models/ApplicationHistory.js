const mongoose = require('mongoose');

const applicationHistorySchema = new mongoose.Schema({
    jobApplicationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'JobApplication', 
        required: true 
    },
    previousStage: { type: String, required: true },
    newStage: { type: String, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    changedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ApplicationHistory', applicationHistorySchema);
