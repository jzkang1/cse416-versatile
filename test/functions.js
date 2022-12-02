const axios = require("axios");

const functions = {
  add: () => null,
  createUser: () => {
    console.log("I'm creating user...");
  },
  testAPI: () =>
    axios
      .get("https://cse416-versatile.herokuapp.com/api/logout")
      .then((res) => res.data)
      .catch((err) => "error"),
};

module.exports = functions;
