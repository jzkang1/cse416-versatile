import React from 'react';
import { useContext, useState, useEffect } from "react";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';

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

    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    }

    const handleCloseUserMenu = (event) => {
        setAnchorElUser(null);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ pt: 4 }}>
                <Typography variant="h3" color="inherit" noWrap align="center">
                    Community
                </Typography>
                <Typography align="center">
                    Get inspirations from fellow users
                </Typography>

                <Toolbar sx={{ borderTop: 1, mt: 3 }}>
                    <Button disabled='true' disableFocusRipple='true' sx={{ 
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
                {store.communityMapCards.map((card) => (
                <Grid item key={card} md={12}>
                    <Card sx={{ height: '250px', display: 'flex', flexDirection: 'row', borderRadius: '8px'}}>
                        <Link to='/mapView'>
                            <CardMedia 
                                component="img"
                                image={require('../images/forest.png')}
                                sx={{ height: '150px'}}
                            />
                        
                        </Link>
                        <Container sx={{ pt: .2, height: '25px', backgroundColor: '#F3FFF3', display: 'flex' }}>
                            <Typography variant="body2">
                                Green Forest
                            </Typography>

                            <FavoriteIcon fontSize='tiny' sx={{ marginLeft: 'auto', mt: .3 }}/>
                            {/* PUT LIKE COUNT HERE */}
                            3

                            <Menu
                                sx={{ mt: "20px" }}
                                id="personal-map-dropdown"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>Delete</MenuItem>
                                <MenuItem onClick={handleCloseUserMenu}>Duplicate</MenuItem>
                            </Menu>
                        </Container>
                    </Card>
                </Grid>
                ))}
            </Grid>
            </Container>
        </ThemeProvider>
    );
}