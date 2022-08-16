const { mongoose } = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    id: mongoose.Types.Decimal128,
    bans: {
        type: Number,
        default: 0,
    },
    kicks: {
        type: Number,
        default: 0,
    },
    warns: {
        type: Number,
        default: 0,
    },
    mutes: {
        type: Number,
        default: 0,
    }
});

module.exports = { userSchema };