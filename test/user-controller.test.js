const map = require("../controllers/user-controller.js");
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

test("Empty test for skipping the error", () => {
  //pass
});

// Test case for registering a user
test("Register a user", () => {
  expect.assertions(2);
  return apis.registerUser(
    {
      firstName: "Jun",
      lastName: "Lee",
      email: "jest_test@stonybrook.edu",
      username: "jest_test",
      password: "jest_test_1234",
      passwordVerify: "jest_test_1234",
      securityQuestion: [
        { question: "What is your favorite color?", answer: "blue" },
      ],
    }.then((data) => {
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
    })
  );
});

// Test case for logging in a user
test("Login a user", () => {
  expect.assertions(2);
  return apis
    .loginUser({
      username: "jest_test",
      password: "jest_test_1234",
    })
    .then((data) => {
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
    });
});

// Test case for logging in with imcomplete input
test("Login with incomplete input", () => {
  expect.assertions(1);
  return apis
    .loginUser({
      username: "jest_test",
    })
    .then((data) => {
      expect(data.errorMessage).toBe("Please enter all required fields.");
    });
});

// Test case for logging out a user
test("Logout a user", () => {
  expect.assertions(1);
  return apis.logoutUser().then((data) => {
    expect(data.success).toBe(true);
  });
});

// Test case for getting a user
test("Get a user", () => {
  expect.assertions(2);
  return apis.getUser("jest_test").then((data) => {
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
  });
});
