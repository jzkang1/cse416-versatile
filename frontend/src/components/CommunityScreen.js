import React from 'react';
import { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

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

export default function CommunityScreen() {
    useEffect(() => {
        store.loadCommunityMaps();
    }, []);

    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleClickMapCard = (event, id) => {
        store.loadMapView(id);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ pt: 4 }}>
                <Typography variant="h3" color="inherit" noWrap align="center">Community</Typography>
                <Typography align="center">Get inspirations from fellow users</Typography>

                <Toolbar sx={{ borderTop: 1, mt: 3 }}>
                    <Button disabled disableFocusRipple='true' sx={{ 
                        "&.MuiButtonBase-root": { color: "primary.main" }, 
                        backgroundColor: "#60DBA0", my: 2, borderRadius: '8px', border: 1, borderColor: 'primary.main' 
                        }}>
                        Sort By
                    </Button>
                    <Button sx={{ backgroundColor: "#CCBBFF", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Date</Button>
                    <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Like</Button>
                    <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Views</Button>
                    <TextField
                        sx={{ marginLeft: "auto" }}
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
            <Grid container spacing={3}>
                {store.communityMapCards.map((map) => (
                <Grid item key={map._id} md={12}>
                    <Card sx={{ height: '250px', display: 'flex', flexDirection: 'row', borderRadius: '8px'}}>
                        <Link onClick={(event) => {handleClickMapCard(event, map._id)}}>
                            <CardMedia 
                                component="img"
                                image={require('../images/forest.png')}
                                sx={{ height: "100%", width: "auto"}}
                            />
                        
                        </Link>
                        
                        <Box display="flex" flexDirection="column">
                            <Typography variant="h4" sx={{ ml: 1 }}>{map.name}</Typography>
                            <Typography variant="body2" sx={{ ml: 2 }}>By {map.owner}</Typography>
                            <Typography variant="body2" sx={{ ml: 2 }}>{map.description ? map.description : "A green forest map with trees and bushes"}</Typography>
                            
                            <Box display="flex" flexDirection="row" marginTop="auto" sx={{ marginTop: "auto" }}>
                                <ThumbUpIcon/>
                                <Typography variant="body2" sx={{ m: 2, mt: "auto"}}>{map.likes === undefined ? 0 : map.likes}</Typography>
                                <ThumbDownIcon/>
                                <Typography variant="body2" sx={{ m: 2, mt: "auto"}}>{map.dislikes === undefined ? 0 : map.dislikes}</Typography>
                                <QuestionAnswerIcon/>
                                <Typography variant="body2" sx={{ m: 2, mt: "auto"}}>{map.comments.length === undefined ? 0 : map.comments.length}</Typography>
                            </Box>
                        </Box>
                        
                        
                            
                    </Card>
                </Grid>
                ))}
            </Grid>
            </Container>
        </ThemeProvider>
    );
}