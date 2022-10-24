const Tileset = require('../models/tileset-model')

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
                                                    message: 'Tilset Created!'
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
        let tileset = await Tileset.findOne({ _id: req.body._id });


    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not update tileset"
        });
    }
}

deleteTileset = async (req, res) => {
    try {
        let tileset = await Tileset.findOneAndDelete({ _id: req.body._id }, () => {
            console.log("deleted success");
            return res.status(200).json({ success: true })
        })
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not create tileset"
        });
    }
}

getTileset = async (req, res) => {
    try {
        let tileset = await Tileset.findOne({ _id: req.body._id });

    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not get tileset"
        });
    }
}

module.exports = {
    createTileset,
    updateTileset,
    deleteTileset,
    getTileset
}