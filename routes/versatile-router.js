const auth = require('../auth')
const express = require('express')

const UserController = require('../controllers/user-controller')
const TilesetController = require('../controllers/tileset-controller')
const MapController = require('../controllers/map-controller')

const router = express.Router()

router.post('/register', UserController.registerUser)
router.get('/loggedIn', UserController.getLoggedIn)
router.get('/logout', UserController.logoutUser)
router.put('/login', UserController.loginUser)

router.get('/getPublicMaps', MapController.getPublicMaps)
router.get('/getPersonalMaps', MapController.getPersonalMaps)
router.post('/createMap', MapController.createMap)
router.put('/updateMap', MapController.updateMap)
router.delete('/deleteMap', MapController.deleteMap)

router.post('/createTileset', TilesetController.createTileset)
router.put('/updateTileset', TilesetController.updateTileset)
router.put('/getTileset', TilesetController.getTileset)
router.delete('/deleteTileset', TilesetController.deleteTileset)

// router.post('/createTSet', TilesetController.)


module.exports = router