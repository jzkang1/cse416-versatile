const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Tileset = require("./tileset-model")

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
        name: { type: String, required: true },
        grid: { type: Object, required: true },
    },
    { timestamps: true },
)

const MapSchema = new Schema(
    {
        name: { type: String, required: true },
        owner: { type: String, required: true },

        height: { type: Number, required: true },
        width: { type: Number, required: true },
        layers: { type: [LayerSchema], required: true },
        tilesets: { type: [String], required: true },
        
        collaborators: { type: [String], required: true },
        createDate: { type: Date, required: true },
        modifyDate: { type: Date, required: true },
        
        isPublished: { type: Boolean, required: true },
        publishDate: { type: Date, required: false }, 

        description: { type: String, required: false },
        views: { type: Number, required: false },
        usersWhoLiked: { type: [String], required: false },
        usersWhoDisliked: { type: [String], required: false },
        comments: { type: [CommentSchema], required: false },

        thumbnailLarge: { type: String, required: false },
        thumbnailSmall: { type: String, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', MapSchema)
