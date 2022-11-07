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
        "layers": [
            {
                "name" : "grass layer",
                "grid": {
                    "data": [
                        [1,2,3,4],
                        [5,6,7,8],
                        [9,10,11,12],
                        [13,14,15,16]
                    ]
                }
            }
        ],
        "tilesets": ["https://thumbs.dreamstime.com/b/seamless-texture-ground-small-stones-concept-design-cute-pattern-brown-cartoon-vector-stone-separate-layers-147597634.jpg"],
        
        "isPublished": true
    }

    const { name, owner, height, width, layers, tilesets, isPublished } = mapDefault;
    let map = new Map({
        name, owner, height, width, layers, tilesets, isPublished
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
