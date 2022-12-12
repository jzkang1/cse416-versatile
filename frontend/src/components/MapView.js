import React, { useState } from "react";
import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://mui.com/">
                Versatile
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const theme = createTheme({
    palette: {
        primary: {
            main: "#002956",
        },
        background: {
            default: "#69C6DE",
        },
    },
});

export default function MapView() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [loading, setLoading] = useState(true);

    const [disabledButtons, setDisabledButtons] = useState(false);


    const navigate = useNavigate();

    const commentRef = useRef();

    const handleClickViewProfile = (event) => {
        // event.stopPropagation();
        // store.loadProfile(store.currentMapView.owner);
        navigate(`/profile/${store.currentMapView.owner}`);
    };

    let { id } = useParams();

    useEffect(() => {
        (async() => {
            await store.loadMapView(id);
            setLoading(false);
        })();
    }, []);


    // if (!store.currentMapView) {
    //     return null;
    // }

    const getLikeOrUnlikeButton = () => {
        if (!auth.user) {
            return (
                <IconButton disabled>
                    <ThumbUpOffAltIcon />
                </IconButton>
            );
        }

        if (!store.currentMapView.usersWhoLiked.includes(auth.user.username)) {
            return (
                <IconButton disabled={disabledButtons} onClick={handleClickLike}>
                    <ThumbUpOffAltIcon />
                </IconButton>
            );
        } else {
            return (
                <IconButton disabled={disabledButtons} onClick={handleClickUnlike}>
                    <ThumbUpIcon />
                </IconButton>
            );
        }
    };

    const getDislikeOrUndislikeButton = () => {
        if (!auth.user) {
            return (
                <IconButton disabled>
                    <ThumbDownOffAltIcon />
                </IconButton>
            );
        }

        if (
            !store.currentMapView.usersWhoDisliked.includes(auth.user.username)
        ) {
            return (
                <IconButton disabled={disabledButtons} onClick={handleClickDislike}>
                    <ThumbDownOffAltIcon />
                </IconButton>
            );
        } else {
            return (
                <IconButton disabled={disabledButtons} onClick={handleClickUndislike}>
                    <ThumbDownIcon />
                </IconButton>
            );
        }
    };

    const getComments = () => {
        let comments = [];
        for (let i = 0; i < store.currentMapView.comments.length; i++) {
            let comment = store.currentMapView.comments[i];

            let commentDate = new Date(comment.date);
            let month = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ][commentDate.getMonth()];
            let day = commentDate.getDate();
            let year = commentDate.getFullYear();
            let dateString = month + " " + day + ", " + year;

            comments.push(
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        borderBottom:
                            i === store.currentMapView.comments.length - 1
                                ? 0
                                : 1,
                    }}
                >
                    <AccountCircleIcon sx={{ fontSize: 40 }} />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography sx={{ fontSize: 20 }}>
                            {comment.username}{" "}
                        </Typography>
                        <Typography sx={{ color: "grey", fontSize: 16 }}>
                            {dateString}{" "}
                        </Typography>
                        <Typography sx={{ fontSize: 16 }}>
                            {comment.text}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return comments;
    };

    const toggleDisabled = async (callback) => {
        setDisabledButtons(true);
        await callback();
        setDisabledButtons(false);
    }

    const handleClickLike = async (event) => {
        setDisabledButtons(true);
        await store.likeMap();
        setDisabledButtons(false);
    };

    const handleClickUnlike = async (event) => {
        setDisabledButtons(true);
        await store.unlikeMap();
        setDisabledButtons(false);
    };

    const handleClickDislike = async (event) => {
        setDisabledButtons(true);
        await store.dislikeMap();
        setDisabledButtons(false);
    };

    const handleClickUndislike = async (event) => {
        setDisabledButtons(true);
        await store.undislikeMap();
        setDisabledButtons(false);
    };

    const handleSubmitComment = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        let comment = {
            username: auth.user.username,
            text: formData.get("comment"),
            date: new Date(),
        };

        store.postComment(comment);

        commentRef.current.value = "";
        commentRef.current.selected = false;
    };

    const handleClickExport = async (event) => {
        event.preventDefault();

        if (!store.currentMapView) {
            return;
        }

        let exportMap = {
            height: (store.currentMapView.height / store.currentMapView.tileHeight),
            infinite: false,
            layers: [],
            orientation: "orthogonal",
            tileheight: store.currentMapView.tileHeight,
            tilesets: [],
            tilewidth: store.currentMapView.tileWidth,
            type: "map",
            version: 1,
            width: (store.currentMapView.width / store.currentMapView.tileWidth),
        };

        let firstgid = 1;
        for (let i = 0; i < store.currentMapView.tilesets.length; i++) {
            let tileset = store.currentMapView.tilesets[i];

            let exportTileset = {
                firstgid: firstgid,
                image: tileset.name,
                imageheight: tileset.imageHeight,
                imagewidth: tileset.imageWidth,
                margin: 0,
                name: tileset.name,
                spacing: 0,
                tileheight: store.currentMapView.tileHeight,
                tilewidth: store.currentMapView.tileWidth,
            };
            exportMap.tilesets.push(exportTileset);

            let numTilesRow = Math.floor(tileset.imageWidth / store.currentMapView.tileWidth);
            let numTilesCol = Math.floor(tileset.imageHeight / store.currentMapView.tileHeight);
            
            firstgid += numTilesRow * numTilesCol;
        }

        for (let i = 0; i < store.currentMapView.layers.length; i++) {
            let layer = store.currentMapView.layers[i];

            let exportLayer = {
                data: [],
                height: exportMap.height,
                name: "layer" + (i+1),
                opacity: 1,
                type: "tilelayer",
                visible: true,
                width: exportMap.width,
                x: 0,
                y: 0
            }

            for (let y = 0; y < layer[0].length; y++) {
                for (let x = 0; x < layer.length; x++) {
                    let [tilesetIndex, tilesetX, tilesetY] = layer[x][y];
                    
                    if (tilesetIndex === -1) {
                        exportLayer["data"].push(0);
                        continue;
                    }
                    
                    let tile_id = 1;

                    // add all tilecounts before current tileset
                    for (let index = 0; index < tilesetIndex; index++) {
                        let numTilesRow = Math.floor(store.currentMapView.tilesets[index].imageHeight / store.currentMapView.tileHeight);
                        let numTilesCol = Math.floor(store.currentMapView.tilesets[index].imageWidth / store.currentMapView.tileWidth);
                        tile_id += numTilesRow*numTilesCol;
                    }

                    // add x offset
                    tile_id += tilesetX

                    // add y offset * length of row
                    tile_id += tilesetY * Math.floor(store.currentMapView.tilesets[tilesetIndex].imageWidth / store.currentMapView.tileWidth);

                    console.log("(" + tilesetX + "," + tilesetY + ")" + " id: " + tile_id)

                    // console.log(layer[x][y])
                    if (tilesetX === 9 && tilesetY === 3) {
                        console.log(tile_id)
                    }
                    
                    exportLayer["data"].push(tile_id);
                }
            }
            exportMap.layers.push(exportLayer);
        }

        const jsonFile = new Blob([JSON.stringify(exportMap, null, 4)], {type: "application/json"});

        let zip = new JSZip();
        zip.file(store.currentMapView.name + ".json", jsonFile);
        for (let tileset of store.currentMapView.tilesets) {
            zip.file(tileset.name + ".png", tileset["data"].split("base64,")[1], {base64: true});
        }
        zip.generateAsync({type:"blob"})
        .then(function(content) {
            FileSaver.saveAs(content, store.currentMapView.name + ".zip");
        });
    };

    const handleDuplicateMap = async (event) => {
        event.stopPropagation();
        await store.handleMakeACopy();
        navigate("/personal");
    };

    if (!store.currentMapView) {
        return null;
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main">
                <CssBaseline />

                <Box
                    backgroundColor={"#DDD2FF"}
                    borderRadius={4}
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            m: 2,
                        }}
                    >
                        <Typography
                            variant="h4"
                            noWrap
                            component="a"
                            sx={{
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                            }}
                        >
                            {loading ? <div>Loading preview<LinearProgress/></div> : store.currentMapView.name}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        {loading || (<Box sx={{ ml: 2, mr: 2, maxWidth: 800 }}>
                            <img style={{
                                "maxWidth": "100%",
                                "maxHeight": "100%"
                            }} src={store.currentMapView.thumbnail} />
                        </Box>)}

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexGrow: 0,
                                alignItems: "center",
                                ml: "auto",
                                mr: 4
                            }}
                        >
                            
                        {loading || <img
                            width="200"
                            height="200"
                            src={require("../images/dog.jpg")}
                            alt="pfp"
                            style={{
                                borderRadius: "50%",
                            }}
                        />}
                        
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                {loading || store.currentMapView.owner}
                            </Typography>

                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                onClick={handleClickViewProfile}
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    color: "grey",
                                    textDecoration: "none",
                                    "&:hover": { cursor: "pointer" }
                                }}
                            >
                                {loading || "View profile"}
                            </Typography>

                            <Box
                                sx={{
                                    marginTop: "auto",
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 2,
                                    flexGrow: 0,
                                }}
                            >
                                {loading || <Button variant="contained" onClick={handleClickExport}>
                                    Export as JSON
                                </Button>}

                                {loading || <Button
                                    variant="contained"
                                    disabled={auth.user === null}
                                    onClick={handleDuplicateMap}
                                >
                                    Make a copy
                                </Button>}
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            borderTop: 1,
                            mt: 2,
                            p: 2,
                            display: "flex",
                            flexDirection: "row",
                            gap: 3,
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <QuestionAnswerIcon />
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                sx={{
                                    ml: 0.6,
                                    mr: 2,
                                    display: { xs: "none", md: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                {loading || store.currentMapView.comments.length} comments
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1 }}></Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexGrow: 0,
                            }}
                        >
                            {loading || getLikeOrUnlikeButton()}
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                sx={{
                                    ml: 0.6,
                                    mr: 2,
                                    display: { xs: "none", md: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                {loading || store.currentMapView.usersWhoLiked.length}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexGrow: 0,
                            }}
                        >
                            {loading || getDislikeOrUndislikeButton()}
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                sx={{
                                    ml: 0.6,
                                    mr: 2,
                                    display: { xs: "none", md: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                {loading || store.currentMapView.usersWhoDisliked.length}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box minWidth={800} minHeight={200} backgroundColor={"white"}>
                    <Box
                        component="form"
                        onSubmit={handleSubmitComment}
                        noValidate
                        sx={{ display: "flex", flexDirection: "row", mt: 2 }}
                    >
                        <TextField
                            autoComplete=""
                            name="comment"
                            required
                            id="comment"
                            label="Write your comment"
                            inputRef={commentRef}
                            sx={{
                                flexGrow: 1,
                                m: 2,
                                borderRadius: 200,
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!auth.user}
                            sx={{ m: 2 }}
                        >
                            Post Comment
                        </Button>
                    </Box>

                    <Stack spacing={2} sx={{ ml: 2, mr: 2 }}>
                        {loading || getComments()}
                    </Stack>
                </Box>

                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
