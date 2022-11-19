const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const TilesetSchema = new Schema(
    {
        name: { type: String, required: true },
        data: { type: String, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Tileset', TilesetSchema)