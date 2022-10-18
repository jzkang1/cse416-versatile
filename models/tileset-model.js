const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const GridRowSchema = new Schema(
    {
        row: { type: [Number], required: true }
    },
    { timestamps: true },
)

const TileSchema = new Schema(
    {
        content: { type: [GridRowSchema], required: true }
    },
    { timestamps: true },
)

const TilesetSchema = new Schema(
    {
        height: { type: Number, required: true },
        width: { type: Number, required: true },
        name: { type: [Number], required: true },
        source: { type: [TileSchema], required: true },
        tile_count: { type: Number, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Tileset', TilesetSchema)