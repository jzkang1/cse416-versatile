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

// const LayerSchema = new Schema(
//     {
//         name: { type: String, required: true },
//         grid: { type: [[String]], required: true },
//     },
//     { timestamps: true },
// )

const TilesetSchema = new Schema(
    {
        name: { type: String, required: true },
        data: { type: String, required: true },
        imageWidth: { type: Number, required: true },
        imageHeight: { type: Number, required: true },
    },
    { timestamps: true },
)

const MapSchema = new Schema(
    {
        name: { type: String, required: true },
        owner: { type: String, required: true },

        height: { type: Number, required: true },
        width: { type: Number, required: true },
        tileHeight: { type: Number, required: true },
        tileWidth: { type: Number, required: true },
        
        layers: { type: [[[[Number]]]], required: true },

        tilesets: { type: [TilesetSchema], required: true },

        collaborators: { type: [String], required: true },
        currentlyBeingEdited: { type: Boolean, required: true },
        createDate: { type: Date, required: true },
        modifyDate: { type: Date, required: true },
        
        isPublished: { type: Boolean, required: true },
        publishDate: { type: Date, required: false },

        views: { type: Number, required: true },
        usersWhoLiked: { type: [String], required: true },
        usersWhoDisliked: { type: [String], required: true },
        comments: { type: [CommentSchema], required: true },

        thumbnail: { type: String, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', MapSchema)
