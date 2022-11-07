import React from "react";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Card, CardMedia } from "@mui/material";
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

export default function ProfileScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleClickMapCard = (event, mapID) => {
        store.loadMapView(mapID);
    }

    let { username } = useParams();

    useEffect(() => {
        store.loadProfile(username);
    }, [])

    if (!store.currentProfileView) {
        return ("profile not found");
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
                            <Typography variant="h3">{store.currentProfileView.username}</Typography>
                            <Stack sx={{ml: 2}}>
                                <Typography variant="h6" color="grey">{store.currentProfileMaps.length} published map {store.currentProfileMaps.length != 1 ? "s" : ""}</Typography>
                                <Typography variant="h6" color="grey">{store.currentProfileView.numLikes ? store.currentProfileView.numLikes : 0} total likes</Typography>
                                <Typography variant="h6" color="grey">{store.currentProfileView.numDislikes ? store.currentProfileView.numDislikes : 0} total dislikes</Typography>
                            </Stack>
                        </Box>
                    </Box>

                    <Toolbar sx={{ borderBottom: 1 }}></Toolbar>

                    <Grid container spacing={4} sx={{mt: 0}}>
                        {store.currentProfileMaps.map((map) => (
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
                                        <Typography sx={{ml: 1}}>{map.views ? map.views : 0}</Typography>
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