const map = require("../controllers/map-controller.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const Map = require("../models/map-model")

beforeAll(() => {
  mongoose.disconnect();
  mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
  });
});

afterAll(() => mongoose.connection.close());

test("Empty test for skipping the error", async () => {

    const mapDefault = {
        "name": "test map",
        "owner": "test owner",
    
        "height": 320,
        "width": 320,
        "layers": [],
        "tilesets": [],
        
        "collaborators": [],
        "createDate": "2022-11-13",
        "modifyDate": "2022-11-13",

        "isPublished": true,

        "tileWidth": 32,
        "tileHeight": 32,
    }

    const {
        name, owner,
        height, width, layers, tilesets,
        collaborators, createDate, modifyDate,
        isPublished,
        tileWidth, tileHeight
    } = mapDefault;

    let map = new Map({
        name, owner,
        height, width, layers, tilesets, 
        collaborators, createDate, modifyDate,
        isPublished,
        tileWidth, tileHeight,
    });

    //create
    await map.save();

    //retrieve
    map = await Map.findOne({name: name});
    expect(map.name).toBe(name)
    expect(map.owner).toBe(owner)

    let mapID = map._id;

    //update
    let newName = "updated test map";
    map.name = newName;
    await Map.findByIdAndUpdate(mapID, map);

    map = await Map.findOne({name: newName});
    expect(map.name).toBe(newName);

    //delete
    await Map.findByIdAndDelete(mapID);
    map = await Map.findById(mapID);
    expect(map).toBe(null);
});
