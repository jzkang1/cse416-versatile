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

router.get('/getPersonalMaps/:username', auth.verify, MapController.getPersonalMaps)
router.get('/getPublicMaps', MapController.getPublicMaps)

router.get('/getMap/:id', MapController.getMap)
router.post('/createMap', auth.verify, MapController.createMap)
router.put('/updateMap', auth.verify, MapController.updateMap)
router.delete('/deleteMap', auth.verify, MapController.deleteMap)
router.get('/getMapsByUser/:username', MapController.getMapsByUser)

router.put('/startEditMap', auth.verify, MapController.startEditMap)
router.put('/endEditMap', auth.verify, MapController.endEditMap)
router.put('/publishMap', auth.verify, MapController.publishMap)
router.post('/duplicateMap', auth.verify, MapController.duplicateMap);

router.put('/likeMap', auth.verify, MapController.likeMap)
router.put('/unlikeMap', auth.verify, MapController.unlikeMap)
router.put('/dislikeMap', auth.verify, MapController.dislikeMap)
router.put('/undislikeMap', auth.verify, MapController.undislikeMap)
router.put('/postComment', auth.verify, MapController.postComment)

router.post('/createTileset', auth.verify, TilesetController.createTileset)
router.post('/updateTileset', auth.verify, TilesetController.updateTileset)
router.delete('/deleteTileset', auth.verify, TilesetController.deleteTileset)

module.exports = router