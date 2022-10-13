const express = require("express");
const cors = require("cors");

const app = express();

app.get("/api/hello/:say", cors(), async (req, res, next) => {
    try {
        const text = req.params.say;
        res.json({
            text: "Hello " + text
        });
    } catch (err) {
        next(err);
    }
})


// Serve our base route that returns a Hello World cow
app.get("/api/hello/", cors(), async (req, res, next) => {
    try {
        res.json({
            text: "Hello World"
        });
    } catch (err) {
        next(err);
    }
})

let x = 5;
let y = "${x}"
// Choose the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Started express app on port ${PORT}`);
})