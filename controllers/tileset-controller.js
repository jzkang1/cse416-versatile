const Map = require("../models/map-model")

// getTilesets = async (req, res) => {
//     try {

//         let maps = await Map.find();

//         let tilesets = [];
//         for (let map of maps) {
//             console.log(map)
//             for (let tileset of map.tilesets) {
//                 tilesets.push(tileset)
//             }
//             // tilesets = tilesets.concat(map.tilesets)
//         }
        
//         if (tilesets) {
//             return res.status(200).json({
//                 success: true,
//                 tilesets: tilesets,
//             });
//         }

//         return res.status(400).json({
//             errorMessage: "Could not get tileset"
//         });
//     } catch (err) {
//         return res.status(400).json({
//             errorMessage: "Could not get tileset"
//         });
//     }
// }

// getTileset = async (req, res) => {
//     try {
//         const _id = req.params.id;

//         let tileset = await Tileset.findOne({ _id: _id });
        
//         if (tileset) {
//             return res.status(200).json({
//                 success: true,
//                 tileset: tileset,
//             });
//         }

//         return res.status(400).json({
//             errorMessage: "Could not get tileset"
//         });
//     } catch (err) {
//         return res.status(400).json({
//             errorMessage: "Could not get tileset"
//         });
//     }
// }


createTileset = async (req, res) => {
    try {
        const { mapID, name, data, imageWidth, imageHeight } = req.body;

        let map = await Map.findOne({ _id: mapID })

        if (!map) {
            return res.status(400).json({
                errorMessage: "Could not create tileset"
            });
        }

        const newTileset = {name, data, imageWidth, imageHeight};
        map.tilesets.push(newTileset);

        await map.save();

        return res.status(200).json({
            success: true,
            map: map,
        })
    } catch (err) {
        return res.status(400).json({
            errorMessage: err
        });
    }
}

updateTileset = async (req, res) => {
    try {
        const { mapID, _id, name, data } = req.body;
        
        let map = await Map.findOne({_id: mapID});

        if (!map) {
            return res.status(400).json({
                errorMessage: "Could not update tileset"
            });
        }

        for (let i = 0; i < map.tilesets.length; i++) {
            if (map.tilesets[i]._id === _id) {
                map.tilesets[i] = {name, data};
                break;
            }
        }

        await map.save();

        return res.status(200).json({
            success: true,
            map: map,
        })
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not update tileset"
        });
    }
}

deleteTileset = async (req, res) => {
    try {
        const { mapID, _id } = req.body;
        let map = await Map.findOne({_id: mapID});

        if (!map) {
            return res.status(400).json({
                errorMessage: "Could not delete tileset"
            });
        }

        let deleted = false;
        for (let i = 0; i < map.tilesets.length; i++) {
            if (map.tilesets[i]._id.toString() === _id) {
                map.tilesets.splice(i, 1);
                deleted = true;
                break;
            }
        }

        await map.save();

        if (deleted) {
            console.log("deleted tileset")
            return res.status(200).json({
                success: true,
                map: map,
            })
        }

        return res.status(400).json({
            success: false
        })
    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not delete tileset"
        });
    }
}



module.exports = {
    createTileset,
    updateTileset,
    deleteTileset
}