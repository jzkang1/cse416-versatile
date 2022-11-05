import React from "react";
import { useContext } from "react";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Card, CardMedia } from "@mui/material";
// import  from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import VisibilityIcon from '@mui/icons-material/Visibility';

const theme = createTheme({
    palette: {
        primary: {
            main: "#002956",
        },
        background: {
            default: "#69C6DE",
        },
    },

    typography: {
        fontFamily: [
            "monospace",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "sans-serif",
        ].join(",")
    }
});

const exampleUser = {
    username: "Tylermcgregor",
    numPublicMaps: 24,
    numLikes: 1002,
    numDislikes: 92,
}

const exampleMaps = [
    {
        _id: "6366c40527b415b2af61b485",
        name: "Green Forest",
        views: 8229
    },

    {
        _id: "6366c40527b415b2af61b485",
        name: "Desert",
        views: 4231
    },

    {
        _id: "6366c40527b415b2af61b485",
        name: "Snowy Mountains",
        views: 910
    },

    {
        _id: "6366c40527b415b2af61b485",
        name: "Ocean",
        views: 21
    },

]

export default function ProfileScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleClickMapCard = (event, mapID) => {
        store.loadMapView(mapID);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ pt: 4 }}>

                <Box
                    backgroundColor={"#DDD2FF"}
                    borderRadius={4}
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Avatar sx={{width: 200, height: 200, ml: 2}} src={require("../images/dog.jpg")}/>
                        <Box sx={{ml: 2, display: "flex", flexDirection: "column"}}>
                            <Typography variant="h3">{exampleUser.username}</Typography>
                            <Stack sx={{ml: 2}}>
                                <Typography variant="h6" color="grey">{exampleUser.numPublicMaps} published maps</Typography>
                                <Typography variant="h6" color="grey">{exampleUser.numLikes} total likes</Typography>
                                <Typography variant="h6" color="grey">{exampleUser.numDislikes} total dislikes</Typography>
                            </Stack>
                        </Box>
                    </Box>

                    <Toolbar sx={{ borderBottom: 1 }}></Toolbar>

                    <Grid container spacing={4} sx={{mt: 0}}>
                        {exampleMaps.map((map) => (
                            <Grid item key={map._id} xs={4} sm={4} md={4} lg={4}>
                                <Card sx={{ display: "flex", flexDirection: "column", borderRadius: 2}}>
                                    <Link onClick={(event) => {handleClickMapCard(event, map._id)}}>
                                        <CardMedia
                                            component="img"
                                            image={require("../images/forest.png")}
                                            sx={{ height: "200px"}}
                                        />
                                    </Link>
                                    <Box sx={{ p: 2, display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <Typography variant="body1">{map.name}</Typography>
                                        <VisibilityIcon fontSize="tiny" sx={{ marginLeft: "auto" }}/>
                                        <Typography sx={{ml: 1}}>{map.views}</Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                 

            </Container>
        </ThemeProvider>
    );
}