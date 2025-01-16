const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
 
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
},{ timestamps: true }
);

const Logs =  mongoose.models.logs || mongoose.model("logs", logSchema);

export default Logs;
