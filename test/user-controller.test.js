const map = require("../controllers/user-controller.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

beforeAll(() => {
  mongoose.disconnect();
  mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
  });
  //   mongoose.connection.on(
  //     "error",
  //     console.error.bind(console, "MongoDB connection error:")
  //   );
});

afterAll(() => mongoose.connection.close());

test("Empty test for skipping the error", () => {
  console.log("I'm fine :)");
});
