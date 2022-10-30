const Tileset = require("../models/tileset-model")

getTileset = async (req, res) => {
    try {
        let tileset = await Tileset.findOne({ _id: req.body._id });
        
        if (tileset) {
            return res.status(200).json({
                success: true,
                message: "Tileset found",
                tileset: tileset,
            });
        }

        return res.status(400).json({
            errorMessage: "Could not get tileset"
        });
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not get tileset"
        });
    }
}

createTileset = async (req, res) => {
    try {
        const { name, height, width, tiles } = req.body;
        const newTileset = new Tileset({
            name, height, width, tiles
        });
        const savedTileset = await newTileset.save()
                                            .then(() => {
                                                return res.status(201).json({
                                                    success: true,
                                                    message: "Tilset Created!"
                                                })
                                            })
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not create tileset"
        });
    }
}

updateTileset = async (req, res) => {
    try {
        const { _id, name, height, width, tiles } = req.body;

        Tileset.findOne({ _id: _id }, (err, tileset) => {
            if (!tileset) {
                return res.status(400).json({
                    success: false
                })
            }
            
            if (name) tileset.name = name
            if (height) tileset.height = height
            if (width) tileset.width = width
            if (tiles) tileset.tiles = tiles

            tileset.save();
            console.log("tileset update success")

            return res.status(200).json({
                success: true,
                _id: _id,
                message: "Tileset updated!",
            })
        });
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not update tileset"
        });
    }
}

deleteTileset = async (req, res) => {
    try {
        const { _id } = req.body;
        await Tileset.findOneAndDelete({ _id: _id });

        console.log("delete tileset success");
        return res.status(200).json({
            success: true
        })
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not delete tileset"
        });
    }
}



module.exports = {
    getTileset,
    createTileset,
    updateTileset,
    deleteTileset,
    getTileset
}