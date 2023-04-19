const mongoose = require('mongoose');

const UserSchema = {
    email: {
        type: String,
        required: true,
        unique: true,
    }, //unique helps in performamve optimization
    password: { type: String, required: true },
}

module.exports = mongoose.model('user', UserSchema);