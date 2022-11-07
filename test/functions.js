const axios = require("axios");

const functions = {
  add: () => null,
  createUser: () => {
    console.log("I'm creating user...");
  },
  testAPI: () =>
    axios
      .get("http://localhost:5001/api/logout")
      .then((res) => res.data)
      .catch((err) => "error"),
  createMap: () =>
    axios
      .post("http://localhost:5001/api/createMap", {
        name: "Forest.tmx",
        owner: "Jun",
        height: 1024,
        width: 768,
        layers: [{}],
        tilesets: ["Forest_tileset"],
        isPublished: false,
      })
      .then((res) => res.data)
      .catch((err) => "error"),
  deleteMap: (_id) =>
    axios
      .delete("http://localhost:5001/api/deleteMap", {
        _id: _id,
      })
      .then((res) => res.data)
      .catch((err) => "error"),
};

module.exports = functions;
