import React from "react";
import { useContext, useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import TextModal from "./TextModal";
import ShareModal from "./ShareModal";
import PersonalCard from "./PersonalCard";
import Box from "@mui/material/Box";

// var fs = require('fs');

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

export default function PersonalScreen() {
    useEffect(() => {
        if (!auth.loggedIn) {
            auth.redirectToLogin("Please log in to view your personal screen.");
        } else {
            store.loadPersonalMaps();
        }
    }, []);

    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [sortState, setSortState] = useState("all");

    const handleSort = (e) => {
        let newSortState = e.target.innerText.toLowerCase();

        store.sortPersonalMaps(newSortState);

        setSortState(newSortState);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const searchText = new FormData(e.currentTarget).get("search");

        console.log(searchText);
        store.searchPersonalMap(searchText);
    };

    const handleCreateMap = (e) => {
        console.log("PersonalScreen.js: Creating Map...");

        store.createMap();

        console.log("PersonalScreen.js: Map Created!");
    };

    return (
        <ThemeProvider theme={theme}>
            <TextModal />
            <ShareModal cards={store.personalMapCards} />
            <CssBaseline />
            <Container maxWidth="lg" sx={{ pt: 4 }}>
                <Typography variant="h3" color="inherit" noWrap align="center">
                    Personal
                </Typography>
                <Typography align="center">Manage your maps</Typography>

                <Toolbar sx={{ borderTop: 1, mt: 3 }}>
                    <Button
                        onClick={handleCreateMap}
                        sx={{
                            backgroundColor: "#60DBA0",
                            my: 2,
                            borderRadius: "8px",
                            border: 1,
                            borderColor: "primary.main",
                        }}
                    >
                        <AddCircleIcon sx={{ mr: 1 }} />
                        Create Map
                    </Button>
                    <Button
                        onClick={handleSort}
                        sx={{
                            backgroundColor:
                                sortState == "all" ? "#CCBBFF" : "#E0D7FB",
                            borderRadius: "8px",
                            my: 2,
                            display: "block",
                            marginLeft: "auto",
                        }}
                    >
                        All
                    </Button>
                    <Button
                        onClick={handleSort}
                        sx={{
                            backgroundColor:
                                sortState == "owned" ? "#CCBBFF" : "#E0D7FB",
                            borderRadius: "8px",
                            my: 2,
                            ml: 2,
                            display: "block",
                        }}
                    >
                        Owned
                    </Button>
                    <Button
                        onClick={handleSort}
                        sx={{
                            backgroundColor:
                                sortState == "shared" ? "#CCBBFF" : "#E0D7FB",
                            borderRadius: "8px",
                            my: 2,
                            ml: 2,
                            display: "block",
                        }}
                    >
                        Shared
                    </Button>

                    <Box
                        component="form"
                        onSubmit={handleSearch}
                        noValidate
                        sx={{ mr: 3, ml: 3, p: 1 }}
                    >
                        <TextField
                            sx={{ width: "110%", marginLeft: "auto" }}
                            size="small"
                            name="search"
                            label="Search"
                            InputProps={{
                                endAdornment: (
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 2, mb: 2, width: "20%" }}
                                    >
                                        <SearchIcon />
                                    </Button>
                                ),
                            }}
                        />
                    </Box>
                </Toolbar>
            </Container>

            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {store.personalMapCards?.map((card) => (
                        <PersonalCard card={card} />
                    ))}
                </Grid>
            </Container>
        </ThemeProvider>
    );
}
