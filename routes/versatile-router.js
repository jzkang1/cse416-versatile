const auth = require('../auth')
const express = require('express')

const MapController = require('../controllers/map-controller')
const TilesetController = require('../controllers/tileset-controller')
const UserController = require('../controllers/user-controller')
const router = express.Router()

// router.get("/hello", async (req, res) => {
//     try {
//         res.status(200).json({
//             success: true,
//             text: "Hello World"
//         });
//     } catch (err) {
//         console.log("error");
//     }
// });


router.post('/register', UserController.registerUser)
router.get('/loggedIn', UserController.getLoggedIn)
router.get('/logout', UserController.logout)
router.post(`/login`, UserController.loginUser)

module.exports = router