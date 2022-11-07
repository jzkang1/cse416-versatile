// const map = require("../controllers/map-controller.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const functions = require("./functions");
const apis = require("../frontend/src/api/index.js");
dotenv.config();

beforeAll(() => {
  // mongoose.disconnect();
  mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
  });
});

afterAll(() => mongoose.connection.close());

let mapID = "";

// Test case for create map
test("Create a map", () => {
  expect.assertions(2);
  return apis
    .createMap({
      name: "Forest.tmx",
      owner: "Jun",
      height: 1024,
      width: 768,
      layers: [{}],
      tilesets: ["Forest_tileset"],
      isPublished: false,
    })
    .then((data) => {
      expect(data.success).toBe(true);
      expect(data.message).toBe("Map Created!");
      mapID = data._id;
    });
});

// Test case for get map
test("Get a map", () => {
  expect.assertions(1);
  return apis.getMap(mapID).then((data) => {
    expect(data.success).toBe(true);
  });
});

// Test case for update map
test("Update a map", () => {
  expect.assertions(1);
  return apis
    .updateMap({
      _id: mapID,
      name: "Forest.tmx",
      owner: "Jun",
      height: 1024,
      width: 768,
      layers: [{}],
      tilesets: ["Forest_tileset"],
      isPublished: false,
    })
    .then((data) => {
      expect(data.success).toBe(true);
    });
});

// Test case for delete map
test("Delete a map", () => {
  expect.assertions(1);
  return apis.deleteMap(mapID).then((data) => {
    expect(data.success).toBe(true);
  });
});

// Test case for delete non-existent map
test("Delete non-existent map", () => {
  expect.assertions(1);
  return apis.deleteMap("non_existent_id").then((data) => {
    expect(data.success).toBeFalsy();
  });
});
