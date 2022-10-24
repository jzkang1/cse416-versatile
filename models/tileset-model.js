const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Tile = new Schema(
    {
        pixels: { type: [Number], required: true }
    }
)

const TilesetSchema = new Schema(
    {
        name: { type: String, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        tiles: { type: [Tile], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Tileset', TilesetSchema)