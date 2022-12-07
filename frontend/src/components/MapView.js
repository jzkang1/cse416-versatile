import React from "react";
import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
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
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    const commentRef = useRef();

    const handleClickViewProfile = (event) => {
        event.stopPropagation();
        store.loadProfile(store.currentMapView.owner);
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
                <IconButton onClick={handleClickLike}>
                    <ThumbUpOffAltIcon />
                </IconButton>
            );
        } else {
            return (
                <IconButton onClick={handleClickUnlike}>
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
                <IconButton onClick={handleClickDislike}>
                    <ThumbDownOffAltIcon />
                </IconButton>
            );
        } else {
            return (
                <IconButton onClick={handleClickUndislike}>
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

    const handleClickLike = (event) => {
        event.stopPropagation();
        store.likeMap();
    };

    const handleClickUnlike = (event) => {
        event.stopPropagation();
        store.unlikeMap();
    };

    const handleClickDislike = (event) => {
        event.stopPropagation();
        store.dislikeMap();
    };

    const handleClickUndislike = (event) => {
        event.stopPropagation();
        store.undislikeMap();
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
            backgroundcolor: "00FFFFFF",
            class: "",
            compressionlevel: -1,
            height: store.currentMapView.height,
            hexsidelength: 0,
            infinite: false,
            layers: [],
            nextlayerid: store.currentMapView.layers.length,
            orientation: "orthogonal",
            parallaxoriginx: 0,
            parallaxoriginy: 0,
            properties: [],
            renderorder: "right-down",
            staggeraxis: 0,
            staggerindex: 0,
            tiledversion: "1.9.1",
            tileheight: store.currentMapView.tileheight,
            tilesets: [],
            tilewidth: store.currentMapView.tilewidth,
            type: "map",
            version: "1.0",
            width: (store.currentMapView.width / store.currentMapView.tileWidth),
        };

        let firstgid = 0;
        for (let i = 0; i < store.currentMapView.tilesets.length; i++) {
            let tileset = store.currentMapView.tilesets[i];

            let exportTileset = {
                backgroundcolor: "00FFFFFF",
                columns: Math.ceil(
                    store.currentMapView.width * store.currentMapView.tileWidth
                ),
                fillmode: "",
                firstgid: firstgid,
                image: tileset.data,
                imageheight: tileset.imageHeight,
                imagewidth: tileset.imageWidth,
                margin: 0,
                name: tileset.name,
                objectalignment: "unspecified",
                properties: [],
                source: tileset.data,
                spacing: 0,
                tilecount: Math.ceil(
                    (tileset.imageWidth * tileset.imageHeight) /
                    (store.currentMapView.tileWidth * store.currentMapView.tileHeight)
                ),
                tiledversion: "1.9.1",
                tileheight: store.currentMapView.tileHeight,
                tilerendersize: "tile",
                tilewidth: store.currentMapView.tileWidth,
                type: "tileset",
                version: "1.6",
            };
            exportMap.tilesets.push(exportTileset);

            firstgid += exportTileset.tilecount;
        }

        for (let i = 0; i < store.currentMapView.layers.length; i++) {
            let layer = store.currentMapView.layers[i];

            console.log(layer);

            let exportLayer = {
                "data": layer,
                "height": exportMap.height,
                "name": layer.name,
                "opacity": 1,
                "properties": [
                    {
                        "name": "tileLayerProp",
                        "type": "int",
                        "value": 1
                    }],
                "type": "tilelayer",
                "visible": true,
                "width": exportMap.width,
                "x": 0,
                "y": 0
            }
            exportMap.layers.push(exportLayer);
        }

        const jsonFile = new Blob([JSON.stringify(exportMap, null, 4)], {type: "application/json"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(jsonFile);
        a.download = store.currentMapView.name + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleDuplicateMap = async (event) => {
        event.stopPropagation();
        await store.handleMakeACopy();
        navigate("/personal");
    };

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
                                flexGrow: 1,
                                alignItems: "center",
                            }}
                        >{loading || <img
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
