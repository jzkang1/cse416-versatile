const Map = require('../models/map-model')

getPublicMaps = async (req, res) => {
    try {
        let maps = await Map.find({}, (err, publicMaps) => {
            
        }).catch(err => console.log(err));
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not retrieve public maps"
        });
    }
}

getPersonalMaps = async(req, res) => {
    try {

    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not retrieve personal maps"
        });
    }
}

createMap = async(req, res) => {
    try {
        const { name, owner, height, width, layers, tilesets, isPublished } = req.body;
        const newMap = new Map({
            name, owner, height, width, layers, tilesets, isPublished
        });
        const savedMap = await newMap.save()
                                            .then(() => {
                                                return res.status(201).json({
                                                    success: true,
                                                    message: 'Map Created!'
                                                })
                                            })
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not create map"
        });
    }
}

updateMap = async(req, res) => {
    try {
        const { name, owner, height, width, layers, tilesets, isPublished, 
            collaborators, createdDate, modifiedDate, publishedDate, description, views, usersWhoLiked, usersWhoDisliked, 
            comments, thumbnailLarge, thumbnailSmall } = req.body;

        Map.findOne({ _id: req.params.id }, (err, map) => {
            if (name) map.name = name
            if (owner) map.owner = owner
            if (height) map.height = height
            if (width) map.width = width
            if (layers) map.layers = layers
            if (tilesets) map.tilesets = tilesets
            if (isPublished) map.isPublished = isPublished
            if (collaborators) map.collaborators = collaborators
            if (createdDate) map.createdDate = createdDate
            if (modifiedDate) map.modifiedDate = modifiedDate
            if (publishedDate) map.publishedDate = publishedDate
            if (description) map.description = description
            if (views) map.views = views
            if (usersWhoLiked) map.usersWhoLiked = usersWhoLiked
            if (usersWhoDisliked) map.usersWhoDisliked = usersWhoDisliked
            if (comments) map.comments = comments
            if (thumbnailLarge) map.thumbnailLarge = thumbnailLarge
            if (thumbnailSmall) map.thumbnailSmall = thumbnailSmall


            Map.save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: map._id,
                        message: 'Map updated!',
                    })
                })
        });
    } catch (err) {
        console.log(err);
    }
}

deleteMap = async(req, res) => {
    try {
        const id = req.params._id;
        console.log(id);
        await Map.findOneAndDelete({ _id: _id }, () => {
            console.log("deleted success");
            return res.status(200).json({ success: true })
        })
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not delete map"
        });
    }
}

duplicateMap = async(req, res) => {
    try {
        
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not duplicate map"
        });
    }
}

module.exports = {
    getPublicMaps,
    getPersonalMaps,
    createMap,
    updateMap,
    deleteMap,
    duplicateMap
}