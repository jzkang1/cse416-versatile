import React from 'react';
import { useContext, useState, useEffect } from "react";

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from '@mui/icons-material/Search';
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import TextModal from './TextModal';
import ShareModal from './ShareModal';
import PersonalCard from './PersonalCard';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme({
    palette: {
        primary: {
            main: "#002956"
        },
        background: {
            default: "#69C6DE"
        }
    }
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 400,
    bgcolor: '#69C6DE',
    border: '2px solid #000',
    borderRadius: 8,
    boxShadow: 24,
    p: 4,
};

export default function PersonalScreen() {
    useEffect(() => {
        if (!auth.loggedIn) {
            auth.redirectToLogin("Please log in to view your personal screen.")
        } else {
            store.loadPersonalMaps();
        }
    }, []);

    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    return (
        <ThemeProvider theme={theme}>
            <TextModal />
            <ShareModal 
                cards={store.personalMapCards}
            />
            <CssBaseline />
            <main>
                <Container maxWidth="lg" sx={{ pt: 4 }}
                >
                    <Typography variant="h3" color="inherit" noWrap align="center">
                        Personal
                    </Typography>
                    <Typography align="center">
                        Manage your maps
                    </Typography>

                    <Toolbar sx={{ borderTop: 1, mt: 3 }}>
                        <Button sx={{ backgroundColor: "#60DBA0", my: 2, borderRadius: '8px', border: 1, borderColor: 'primary.main' }}>
                            <AddCircleIcon sx={{ mr: 1 }} />
                            Create Map
                        </Button>
                        <Button sx={{ backgroundColor: "#CCBBFF", borderRadius: '8px', my: 2, display: "block", marginLeft: "auto" }}>All</Button>
                        <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Owned</Button>
                        <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Shared</Button>
                        <TextField
                            sx={{ ml: 3 }}
                            size="small"
                            label="Search"
                            InputProps={{
                                endAdornment: (
                                    <SearchIcon />
                                )
                            }}
                        />
                    </Toolbar>
                </Container>

                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {store.personalMapCards?.map((card) => (
                            <PersonalCard 
                                card={card}
                            />
                        ))}
                    </Grid>
                </Container>
            </main>
        </ThemeProvider>
    );
}