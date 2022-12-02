const map = require("../controllers/tileset-controller.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const apis = require("../frontend/src/api/index.js");
dotenv.config();

beforeAll(() => {
  mongoose.disconnect();
  mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
  });
  // mongoose.connection.on(
  //   "error",
  //   console.error.bind(console, "MongoDB connection error:")
  // );
});

afterAll(() => mongoose.connection.close());

// Test case for creating a tileset
test("Create a tileset", () => {
  expect.assertions(2);
  return apis
    .createTileset({
      name: "Background",
      height: 640,
      width: 640,
      tiles: [{ pixels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
    })
    .then((data) => {
      expect(data.success).toBe(true);
      expect(data.message).toBe("Tileset Created!");
    });
});

// Test case for getting a tileset
test("Get a tileset named 'test_tileset'", () => {
  expect.assertions(1);
  return apis.getTileset("6368826e62d280edaf8022b0").then((data) => {
    expect(data.success).toBe(true);
  });
});

// Test case for getting a non-existent tileset
test("Get a non-existent tileset", () => {
  expect.assertions(1);
  return apis.getTileset("non_existent_tileset_id").then((data) => {
    expect(data.success).toBe(false);
  });
});

// Test case for updating a tileset
test("Update a tileset", () => {
  expect.assertions(1);
  return apis
    .updateTileset({
      _id: "6368826e62d280edaf8022b0",
      name: "Background",
      height: 640,
      width: 640,
      tiles: [{ pixels: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0] }],
    })
    .then((data) => {
      expect(data.success).toBe(true);
    });
});
