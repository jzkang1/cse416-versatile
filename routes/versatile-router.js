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
router.get('/getUser/:username', UserController.getUser)
router.put('/sendCode', UserController.sendRecoveryCode)
router.put('/validateCode', UserController.validateRecoveryCode)
router.put('/changePassword', UserController.changePassword)

router.get('/getPersonalMaps', MapController.getPersonalMaps)
router.get('/getPublicMaps', MapController.getPublicMaps)

router.get('/getMap/:id', MapController.getMap)
router.post('/createMap', MapController.createMap)
router.put('/updateMap', MapController.updateMap)
router.delete('/deleteMap', MapController.deleteMap)

router.get('/getMapsByUser/:username', MapController.getMapsByUser);

router.get('getTileset', TilesetController.getTileset)
router.post('/createTileset', TilesetController.createTileset)
router.put('/updateTileset', TilesetController.updateTileset)
router.put('/getTileset', TilesetController.getTileset)
router.delete('/deleteTileset', TilesetController.deleteTileset)

module.exports = router