// const map = require("../controllers/map-controller.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const functions = require("./functions");
const apis = require("../frontend/src/api/index.js");
dotenv.config();

const Map = require("../models/map-model");

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

/*

test("Empty test for skipping the error", async () => {
  const mapDefault = {
    name: "test map",
    owner: "test owner",

    height: 320,
    width: 320,
    layers: [
      {
        name: "grass layer",
        grid: {
          data: [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16],
          ],
        },
      },
    ],
    tilesets: [],

    collaborators: [],
    createDate: "2022-11-13",
    modifyDate: "2022-11-13",

    isPublished: true,
  };

  const {
    name,
    owner,
    height,
    width,
    layers,
    tilesets,
    collaborators,
    createDate,
    modifyDate,
    isPublished,
  } = mapDefault;

  let map = new Map({
    name,
    owner,
    height,
    width,
    layers,
    tilesets,
    collaborators,
    createDate,
    modifyDate,
    isPublished,
  });

  //create
  await map.save();

  //retrieve
  map = await Map.findOne({ name: name });
  expect(map.name).toBe(name);
  expect(map.owner).toBe(owner);

  let mapID = map._id;

  //update
  let newName = "updated test map";
  map.name = newName;
  await Map.findByIdAndUpdate(mapID, map);

  map = await Map.findOne({ name: newName });
  expect(map.name).toBe(newName);

  //delete
  await Map.findByIdAndDelete(mapID);
  map = await Map.findById(mapID);
  expect(map).toBe(null);
});

*/
