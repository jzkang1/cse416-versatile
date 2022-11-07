// const map = require("../controllers/map-controller.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const functions = require("./functions");
dotenv.config();

beforeAll(() => {
  // mongoose.disconnect();
  mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
  });
});

afterAll(() => mongoose.connection.close());

let mapID = "";
test("Create a map", () => {
  expect.assertions(2);
  return functions.createMap().then((data) => {
    expect(data.success).toBe(true);
    expect(data.message).toBe("Map Created!");
    mapID = data._id;
    console.log("mapID: " + mapID);
  });
});

test("Delete a map", () => {
  expect.assertions(1);
  return functions.deleteMap(mapID).then((data) => {
    expect(data.success).toBe(true);
  });
});

// test("Delete non-existent map", () => {
//   expect.assertions(1);
//   return functions.deleteMap("random_id").then((data) => {
//     expect(data.success).toBeFalsy();
//   });
// });
