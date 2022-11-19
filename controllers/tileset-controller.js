const Tileset = require("../models/tileset-model")

getTilesets = async (req, res) => {
    try {

        let tilesets = await Tileset.find();
        
        if (tilesets) {
            return res.status(200).json({
                success: true,
                tilesets: tilesets,
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

getTileset = async (req, res) => {
    try {
        const _id = req.params.id;

        let tileset = await Tileset.findOne({ _id: _id });
        
        if (tileset) {
            return res.status(200).json({
                success: true,
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
        const { name, data } = req.body;
        const newTileset = new Tileset({ name, data });

        newTileset.save().then(() => {
            return res.status(201).json({
                success: true,
                tileset: newTileset
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
        const { _id, name, data } = req.body;

        Tileset.findOne({ _id: _id }, (err, tileset) => {
            if (!tileset) {
                return res.status(400).json({
                    success: false
                })
            }
            
            if (name) tileset.name = name
            if (data) tileset.data = data

            tileset.save();

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
        let tileset = await Tileset.findOneAndDelete({ _id: _id });

        if (!tileset) {
            return res.status(400).json({
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            message: "Tileset deleted!",
        })
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not delete tileset"
        });
    }
}



module.exports = {
    getTilesets,
    getTileset,
    createTileset,
    updateTileset,
    deleteTileset
}