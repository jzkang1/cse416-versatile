const express = require("express");
const cors = require("cors");
const path = require('path')

const app = express();


app.use(express.urlencoded({ extended: true }))

let x = app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
app.use(express.json())

app.get("/api/hello/:say", cors(), async (req, res) => {
    try {
        const text = req.params.say;
        res.status(200).json({
            text: "Hello " + text
        });
    } catch (err) {
        console.log("error");
    }
});


// Serve our base route that returns a Hello World cow
app.get("/api/hello/", cors(), async (req, res) => {
    try {
        res.json({
            text: "Hello World"
        });
    } catch (err) {
        console.log("error");
    }
});

// Choose the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Started express app on port ${PORT}`);
})


// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
});