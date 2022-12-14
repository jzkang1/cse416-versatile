const Map = require("../models/map-model");

getPersonalMaps = async (req, res) => {
	try {
		const {
			username
		} = req.params;

		let personalMaps = await Map.find({
			owner: username
		});
		let sharedMaps = await Map.find({
			collaborators: username
		});

		personalMaps = personalMaps.concat(sharedMaps);

		if (personalMaps) {
			return res.status(200).json({
				success: true,
				personalMaps: personalMaps,
			});
		}
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not retrieve personal maps",
		});
	}
};

getPublicMaps = async (req, res) => {
	try {
		let publicMaps = await Map.find({
			isPublished: true
		});

		if (publicMaps) {
			return res.status(200).json({
				success: true,
				publicMaps: publicMaps,
			});
		}

		return res.status(400).json({
			errorMessage: "Could not retrieve public maps",
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not retrieve public maps",
		});
	}
};

getMap = async (req, res) => {
	try {
		const _id = req.params.id;

		let map = await Map.findOne({ _id: _id });

		if (map) {
            if (map.isPublished) {
                console.log("map is published")
                map.views++;
                await map.save();
            }

            console.log(map.views)

			return res.status(200).json({
				success: true,
				map: map,
			});
		}

		return res.status(400).json({
			errorMessage: "Could not retrieve map",
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not retrieve map",
		});
	}
};

createMap = async (req, res) => {
	try {
		const {
			name,
			owner,
			height,
			width,
			tileHeight,
			tileWidth
		} = req.body;

		if (!name || !owner || !height || !width) {
			return res.status(400).json({
				errorMessage: "Could not create map",
			});
		}

		let map = [];
		for (let i = 0; i < width / tileWidth; i++) {
			map.push([]);
			for (let j = 0; j < height / tileHeight; j++) {
				map[i].push([-1, -1, -1]);
			}
		}

		const layers = map
		const tilesets = [];

		const collaborators = [];
		const currentlyBeingEdited = false;
		const createDate = new Date();
		const modifyDate = new Date();

		const isPublished = false;

        const views = 0;
        const usersWhoLiked = [];
        const usersWhoDisliked = [];
        const comments = [];

		const newMap = new Map({
			name,
			owner,
			height,
			width,
			tileHeight,
			tileWidth,
			layers,
			tilesets,
			collaborators,
			currentlyBeingEdited,
			createDate,
			modifyDate,
			isPublished,
            views,
            usersWhoLiked,
            usersWhoDisliked,
            comments
		});

		await newMap.save();

		return res.status(201).json({
			success: true,
			message: "Map Created!",
			map: newMap,
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not create map",
		});
	}
};

updateMap = async (req, res) => {
	try {
		const {
			_id,
			name,
			owner,

			height,
			width,
			tileHeight,
			tileWidth,
			layers,
			tilesets,

			collaborators,
			createDate,
			modifyDate,

			isPublished,
			publishDate,
            
			views,
			usersWhoLiked,
			usersWhoDisliked,
			comments,

			thumbnail,
		} = req.body;

		Map.findOne({
			_id: _id
		}, (err, map) => {
			if (!map) {
				return res.status(400).json({
					success: false,
				});
			}

			if (name) map.name = name;
			if (owner) map.owner = owner;

			if (height) map.height = height;
			if (width) map.width = width;
			if (tileHeight) map.tileHeight = tileHeight;
			if (tileWidth) map.tileWidth = tileWidth;
			if (layers) map.layers = layers;
			if (tilesets) map.tilesets = tilesets;

			if (collaborators) map.collaborators = collaborators;
			if (createDate) map.createDate = createDate;
			if (modifyDate) map.modifyDate = modifyDate;

			if (isPublished) map.isPublished = isPublished;
			if (publishDate) map.publishDate = publishDate;
            
			if (views) map.views = views;
			if (usersWhoLiked) map.usersWhoLiked = usersWhoLiked;
			if (usersWhoDisliked) map.usersWhoDisliked = usersWhoDisliked;

			if (comments) map.comments = comments;
			if (thumbnail) map.thumbnail = thumbnail;

			map.save();
			console.log("map update success");
			return res.status(200).json({
				success: true,
				_id: _id,
				message: "Map updated!",
			});
		});
	} catch (err) {
		console.log(err);
	}
};

deleteMap = async (req, res) => {
	try {
		const {
			_id
		} = req.body;

		let map = await Map.findOneAndDelete({
			_id: _id
		});

		if (map) {
			return res.status(200).json({
				success: true,
			});
		}

		return res.status(400).json({
			success: false,
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not delete map",
			err: err,
		});
	}
};

getMapsByUser = async (req, res) => {
	try {
		const {
			username
		} = req.params;
		let ownedMaps = await Map.find({
			owner: username,
			isPublished: true
		});

		if (ownedMaps) {
			return res.status(200).json({
				success: true,
				maps: ownedMaps,
			});
		}

		return res.status(400).json({
			errorMessage: "Could not delete map"
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not delete map",
			err: err
		});
	}
}

startEditMap = async (req, res) => {
	try {
		const {
			_id
		} = req.body;

		let map = await Map.findOne({
			_id: _id
		});
		if (!map) {
			return res.status(400).json({
				errorMessage: "Could not start map edit"
			});
		}

		map.currentlyBeingEdited = true;

		await map.save();

		return res.status(200).json({
			success: true
		})

	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not start map edit"
		});
	}
}

endEditMap = async (req, res) => {
	try {
		const {
			_id
		} = req.body;

		let map = await Map.findOne({
			_id: _id
		});
		if (!map) {
			return res.status(400).json({
				errorMessage: "Could not end map edit"
			});
		}

		map.currentlyBeingEdited = false;

		await map.save();

		return res.status(200).json({
			success: true
		})

	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not end map edit"
		});
	}
}

publishMap = async (req, res) => {
	try {
		const {
			_id
		} = req.body;

		let map = await Map.findOne({
			_id: _id
		});
		if (!map) {
			return res.status(400).json({
				errorMessage: "Could not publish map"
			});
		}

		map.isPublished = true;

		await map.save();

		console.log("successfully published");

		return res.status(200).json({
			success: true,
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: err
		});
	}
};

duplicateMap = async (req, res) => {
	try {
		const { _id } = req.body;
		let { owner } = req.body;

		let map = await Map.findOne({
			_id: _id
		});

		if (!map) {
			return res.status(400).json({
				errorMessage: "Could not duplicate map",
			});
		}
		let name;
		if (!owner) {
			// if owner is undefined, it is duplicated from personal
			owner = map.owner;
			name = map.name + " (copy)";
		} else {
			// otherwise, it is duplicated from community
			name = map.name + ` (copy of ${map.owner}'s map)`;
		}

		const {
			height,
			width,
			tileHeight,
			tileWidth,
			layers,
			tilesets,
			collaborators,
			thumbnail,
		} = map;

        const currentlyBeingEdited = false;

		const createDate = new Date();
		const modifyDate = new Date();
		const isPublished = false;

        const views = 0;
        const usersWhoLiked = [];
        const usersWhoDisliked = [];
        const comments = [];
        

		const newMap = new Map({
			name,
			owner,
			height,
			width,
			tileHeight,
			tileWidth,
			layers,
			tilesets,
			collaborators,
            currentlyBeingEdited,
			createDate,
			modifyDate,
			isPublished,
			thumbnail,
            views,
            usersWhoLiked,
            usersWhoDisliked,
            comments
		});

		await newMap.save();

		return res.status(201).json({
			success: true,
			message: "Map duplicated!",
			map: newMap,
		});
	} catch (err) {
		return res.status(400).json({
			err
		});
	}
};

likeMap = async (req, res) => {
	try {
		const {
			_id,
			username
		} = req.body;

		let map = await Map.findOne({
			_id: _id
		});

		map.usersWhoLiked.push(username);

		await map.save();

		return res.status(200).json({
			success: true,
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not like map",
		});
	}
};

unlikeMap = async (req, res) => {
	try {
		const {
			_id,
			username
		} = req.body;

		let map = await Map.findOne({
			_id: _id
		});

		let index = map.usersWhoLiked.indexOf(username);
		if (index !== -1) {
			map.usersWhoLiked.splice(index, 1);
		}

		await map.save();

		return res.status(200).json({
			success: true,
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not unlike map",
		});
	}
};

dislikeMap = async (req, res) => {
	try {
		const {
			_id,
			username
		} = req.body;

		let map = await Map.findOne({
			_id: _id
		});

		map.usersWhoDisliked.push(username);

		await map.save();

		return res.status(200).json({
			success: true,
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not dislike map",
		});
	}
};

undislikeMap = async (req, res) => {
	try {
		const {
			_id,
			username
		} = req.body;

		let map = await Map.findOne({
			_id: _id
		});

		let index = map.usersWhoDisliked.indexOf(username);
		if (index !== -1) {
			map.usersWhoDisliked.splice(index, 1);
		}

		await map.save();

		return res.status(200).json({
			success: true,
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not undislike map",
		});
	}
};

postComment = async (req, res) => {
	try {
		const {
			_id,
			comment
		} = req.body;

		let map = await Map.findOne({
			_id: _id
		});

		map.comments.push(comment);

		await map.save();

		return res.status(200).json({
			success: true,
		});
	} catch (err) {
		return res.status(400).json({
			errorMessage: "Could not post comment",
		});
	}
};

module.exports = {
	getPersonalMaps,
	getPublicMaps,
	getMap,
	createMap,
	updateMap,
	deleteMap,
	getMapsByUser,

	startEditMap,
	endEditMap,
	publishMap,

	duplicateMap,
	likeMap,
	unlikeMap,
	dislikeMap,
	undislikeMap,
	postComment
}