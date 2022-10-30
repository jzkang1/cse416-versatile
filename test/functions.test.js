const functions = require("./functions");

test("Create users", () => {
  expect(null).toBeNull();
});

test("Response must be true", () => {
  // expect.assertions(1);
  return functions.testAPI().then((data) => {
    expect(data.success).toBe(true);
  });
});

test("Response must not be false", () => {
  // expect.assertions(1);
  return functions.testAPI().then((data) => {
    expect(data.success).not.toBe(false);
  });
});
