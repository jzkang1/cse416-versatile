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

    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not update map"
        });
    }
}

updateMap = async(req, res) => {
    try {

    } catch (err) {
        return res.status(400).json({
            errorMessage: "Could not update map"
        });
    }
}

deleteMap = async(req, res) => {
    try {
        let id = req.body.id;
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