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
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import VisibilityIcon from '@mui/icons-material/Visibility';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Menu from "@mui/material/Menu";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Stack from "@mui/material/Stack"

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

    const handleSearch = (e) => {
        e.preventDefault();

        const searchText = new FormData(e.currentTarget).get("search");

        store.searchCommunityMap(searchText)
    }

    const [anchorSortMenu, setAnchorSortMenu] = useState(null);

    const handleOpenSortMenu = (event) => {
        setAnchorSortMenu(event.currentTarget);
    };

    const handleCloseSortMenu = () => {
        setAnchorSortMenu(null);
    };

    const [sortState, setSortState] = useState("none");
    const [sortVal, setSortVal] = useState(1);
    
    const handleSort = (e) => {
        let newSortState = e.target.innerText
        console.log(e.target)

        if (newSortState != sortState){ 
            store.sortCommunityMaps(newSortState, 1)
            setSortVal(1);
        }
        if (newSortState == sortState){
            store.sortCommunityMaps(newSortState, -sortVal)
            setSortVal(-sortVal);   
        }

        setSortState(newSortState);

        console.log(sortVal)
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ pt: 4 }}>
                <Typography variant="h3" color="inherit" noWrap align="center">Community</Typography>
                <Typography align="center">Get inspirations from fellow users</Typography>


                <Toolbar sx={{ borderTop: 1, mt: 3 }}>

                    <Button
                        id="demo-customized-button"
                        aria-controls={Boolean(anchorSortMenu) ? 'demo-customized-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={Boolean(anchorSortMenu) ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleOpenSortMenu}
                        endIcon={<KeyboardArrowDownIcon />}
                    >
                        Sort By
                    </Button>

                    <Menu
                        sx={{ mt: "36px" }}
                        id="menu-appbar"
                        anchorEl={anchorSortMenu}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        open={Boolean(anchorSortMenu)}
                        onClose={handleCloseSortMenu}
                    >
                        <MenuList sx={{ width: 320, maxWidth: '100%' }}>
                            <MenuItem sx={{ width: '100%'}}>
                                <ListItemText onClick={handleSort}>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        
                                        Date
                                        {(sortState == "Date") ? (sortVal == 1) ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/> : null}
                                        
                                    </Stack>
                                </ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemText onClick={handleSort}>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        Like
                                        {(sortState == "Like") ? (sortVal == 1) ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/> : null}
                                    </Stack>
                                </ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemText onClick={handleSort}>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        Views
                                        {(sortState == "Views") ? (sortVal == 1) ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/> : null}
                                    </Stack>
                                </ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Menu>

                    
                    
                    <Box component="form" onSubmit={handleSearch} noValidate sx={{ mr: 3, p: 1, marginLeft: 'auto' }}>
                            <TextField
                            sx={{ width: '110%', marginLeft: "auto" }}
                            size="small"
                            name="search"
                            label="Search"
                            InputProps={{
                                endAdornment: (
                                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2, width: '20%' }}>
                                        <SearchIcon />
                                    </Button>
                                )
                            }}/>
                    </Box>

                </Toolbar>
            </Container>

            <Container maxWidth="lg">
            <Grid container spacing={3}>
                {store.communityMapCards?.map((map) => (
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
                            
                            <Box display="flex" flexDirection="row" marginTop="auto" sx={{ marginTop: "auto", ml: 2 }}>
                                <ThumbUpIcon/>
                                <Typography variant="body2" sx={{ m: 2, mt: "auto"}}>{map.usersWhoLiked.length}</Typography>
                                <ThumbDownIcon/>
                                <Typography variant="body2" sx={{ m: 2, mt: "auto"}}>{map.usersWhoDisliked.length}</Typography>
                                <QuestionAnswerIcon/>
                                <Typography variant="body2" sx={{ m: 2, mt: "auto"}}>{map.comments.length === undefined ? 0 : map.comments.length}</Typography>
                                <VisibilityIcon/>
                                <Typography variant="body2" sx={{ m: 2, mt: "auto"}}>{map.comments.length === undefined ? 0 : map.views}</Typography>
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