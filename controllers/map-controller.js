const Map = require("../models/map-model")

getPersonalMaps = async(req, res) => {
    try {
        const { username } = req.query;
      
        let personalMaps = await Map.find({ owner: username });

        if (personalMaps) {
            return res.status(200).json({
                success: true,
                personalMaps: personalMaps
            })
        }
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not retrieve personal maps"
        });
    }
}

getPublicMaps = async (req, res) => {
    try {
        let publicMaps = await Map.find({ isPublished: true });

        if (publicMaps) {
            return res.status(200).json({
                success: true,
                publicMaps: publicMaps
            })
        }

        return res.status(400).json({
            errorMessage: "Could not retrieve public maps"
        });
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not retrieve public maps"
        });
    }
}

getMap = async (req, res) => {
    try {
        const _id  = req.params.id;

        let map = await Map.findOne({_id : _id});

        if (map) {
            return res.status(200).json({
                success: true,
                map: map
            })
        }

        return res.status(400).json({
            errorMessage: "Could not retrieve map"
        });
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not retrieve map"
        });
    }
}

createMap = async(req, res) => {
    try {
        const { name, owner, height, width, layers, tilesets, isPublished } = req.body;

        const newMap = new Map({
            name, owner, height, width, layers, tilesets, isPublished
        });
        
        newMap.save().then(() => {
            return res.status(201).json({
                success: true,
                message: "Map Created!",
                map: newMap
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
        const { _id, name, owner, height, width, layers, tilesets, isPublished, 
            collaborators, createdDate, modifiedDate, publishedDate, description, views, usersWhoLiked, usersWhoDisliked, 
            comments, thumbnailLarge, thumbnailSmall } = req.body;

        console.log(req.body)
        Map.findOne({ _id: _id }, (err, map) => {
            if (!map) {
                return res.status(400).json({
                    success: false
                })
            }

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

            map.save();
            console.log("map update success")
            return res.status(200).json({
                success: true,
                _id: _id,
                message: "Map updated!",
            })
        });
    } catch (err) {
        console.log(err);
    }
}

deleteMap = async(req, res) => {
    try {
        const { _id } = req.body;
        await Map.findOneAndDelete({ _id: _id });
        console.log("delete success");
        return res.status(200).json({
            success: true
        })
        
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not delete map",
            err: err
        });
    }
}

getMapsByUser = async (req, res) => {
    try {
        const { username } = req.params;

        let ownedMaps = await Map.find({ owner: username });
        
        if (ownedMaps) {
            return res.status(200).json({
                success: true,
                maps: ownedMaps
            });
        }

        return res.status(400).json({
            errorMessage: "Could not delete map"
        });
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not delete map",
            err: err
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
    getPersonalMaps,
    getPublicMaps,
    getMap,
    createMap,
    updateMap,
    deleteMap,
    getMapsByUser,
    duplicateMap,
}