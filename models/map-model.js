const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema(
    {
        username: { type: String, required: true },
        text: { type: String, required: true },
        date: { type: Date, required: true },
    },
    { timestamps: true },
)

const LayerSchema = new Schema(
    {
        data: { type: [Number], required: true },
        name: { type: String, required: true },
        opacity: { type: Number, required: true },
    },
    { timestamps: true },
)

const MapSchema = new Schema(
    {
        tiled_version: { type: String, required: true },
        height: { type: Number, required: true },
        width: { type: Number, required: true },
        layers: { type: [LayerSchema], required: true },
        tilesets: { type: [Tileset], required: true },
        
        name: { type: String, required: true },
        owner: { type: String, required: true },
        collaborators: { type: [String], required: true },
        created_date: { type: Date, required: true },
        modified_date: { type: Date, required: true },
        
        isPublished: { type: Boolean, required: true },
        published_date: { type: Date, required: true }, 
        description: { type: String, required: true },
        views: { type: Number, required: true },
        users_who_disliked: { type: [String], required: true },
        users_who_liked: { type: [String], required: true }, 
        comments: { type: [CommentSchema], required: true },

        thumbnail_large: { type: String, required: true },
        thumbnail_small: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', MapSchema)
