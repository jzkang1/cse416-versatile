const express = require("express");
const cors = require("cors");
const path = require('path')
const cookies = require("cookie-parser")

const app = express();
app.use(cookies())

app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
app.use(express.json())

const versatileRouter = require('./routes/versatile-router');
app.use('/api', versatileRouter);

// Choose the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Started express app on port ${PORT}`);
})

// INITIALIZE OUR DATABASE OBJECT
const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// // // Serve static files from the React frontend app
// if (!process.env.LOCAL) {
//     app.use(express.static(path.join(__dirname, 'frontend/build')));
// }

// // // Anything that doesn't match the above, send back index.html
// if (!process.env.LOCAL) {
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
//     });
// }