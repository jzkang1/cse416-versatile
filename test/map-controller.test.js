const map = require("/controllers/map-controller.js")
const dotenv = require('dotenv')
const db = require('./db')


beforeAll(() => db.on('error', console.error.bind(console, 'MongoDB connection error:')))

afterAll(() => db.disconnect())


