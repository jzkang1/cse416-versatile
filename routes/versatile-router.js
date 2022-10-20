const express = require('express')
const router = express.Router()

router.get("/hello", async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            text: "Hello World"
        });
    } catch (err) {
        console.log("error");
    }
});


module.exports = router