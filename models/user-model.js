const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const securityQA = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const UserSchema = new Schema(
    {
        username: { type: String, required: true },
        passwordHash: { type: String, required: true },
        email: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        join_date: {type: Date, required: true },
        profile_image: { type: String, required: true },
        security_question: { type: [securityQA], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)
