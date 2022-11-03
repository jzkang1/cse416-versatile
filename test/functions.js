const axios = require("axios");

const functions = {
  add: () => null,
  createUser: () => {
    console.log("I'm creating user...");
  },
  testAPI: () =>
    axios
      .get("localhost:3000/api/logout")
      .then((res) => res.data)
      .catch((err) => "error"),
};

module.exports = functions;
