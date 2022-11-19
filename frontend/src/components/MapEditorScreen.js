import React from 'react';
import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import PanToolIcon from '@mui/icons-material/PanTool';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import LayersIcon from '@mui/icons-material/Layers';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import SettingsIcon from '@mui/icons-material/Settings';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapVertIcon from '@mui/icons-material/SwapVert';

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

export default function MapEditorScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    let { id } = useParams();
    
    useEffect(() => {
        store.loadMapEdit(id);
    }, []);

    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const getTilesets = () => {
        if (!store.currentMapEdit) {
            return null;
        }

        let tilesets = [];
        for (let i = 0; i < store.currentMapEdit.tilesets.length; i++) {
            let tileset = store.currentMapEdit.tilesets[i];

            console.log(tileset)

            tilesets.push(
                <Grid item key={tileset._id} md={4}>
                    <Link to="/tileEditor">
                        <Card>
                            <CardMedia component="img" image={tileset.data}/>
                        </Card>
                    </Link>
                </Grid>
            );
        }

        return tilesets;
    }

    const handleTilesetUpload = (event) => {
        if (!event.target.files) {
            return;
        }

        const file = event.target.files[0];

        const filename = file.name;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (!event?.target?.result) {
              return;
            }

            const imageString = event.target.result;

            store.createTileset(store.currentMapEdit._id, filename, imageString);
        }

        reader.readAsDataURL(file);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container disableGutters maxWidth="lg" sx={{ mt: 4, pt: 2, border: 1, backgroundColor: "#DDD2FF" }}
            >
                <Toolbar sx={{ mt: -1.5, justifyContent: "center" }}>
                    <Typography variant="h3" color="inherit" noWrap align="center" sx={{ ml: 3 }}>
                        Forest in Amazon
                    </Typography>
                    <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, display: "block", marginLeft: "auto" }}>Share</Button>
                    <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Save</Button>
                    <Button sx={{ backgroundColor: "#CCBBFF", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Exit</Button>
                </Toolbar>

                    
                <Toolbar disableGutters sx={{ mt: 0, borderTop: 1, borderBottom: 1 }}>
                    <Button sx={{ display: "block" }}><PanToolIcon/></Button>
                    <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block" }}><PanToolAltIcon/></Button>
                    <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block" }}><LayersIcon/></Button>
                    <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block"}}><FormatColorFillIcon/></Button>
                    <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block"}}><LayersClearIcon/></Button>

                    <Button onClick={handleOpenUserMenu} sx={{ display: "block", marginLeft: "auto" }}><DynamicFeedIcon/></Button>
                    <Button sx={{ display: "block" }}><SettingsIcon/></Button>

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
                        <MenuItem onClick={handleCloseUserMenu}>Layers<AddIcon sx={{ marginLeft: "auto" }}/></MenuItem>
                        <MenuItem onClick={handleCloseUserMenu}><SwapVertIcon/>Background<DeleteIcon sx={{ marginLeft: "auto" }}/></MenuItem>
                        <MenuItem onClick={handleCloseUserMenu}><SwapVertIcon/>Smiley<DeleteIcon sx={{ marginLeft: "auto" }}/></MenuItem>
                        
                    </Menu>
                </Toolbar>
            </Container>

            <Container disableGutters maxWidth="lg" sx={{ border: 1, backgroundColor: "#DDD2FF" }}>
                <Grid container component="main" sx={{ minHeight: '60vh' }}>
                    <Grid container md={2}>
                        {getTilesets()}
                        <Toolbar disableGutters sx={{ borderTop: 1 }}>
                            <Button variant="contained" sx={{ marginLeft: 'auto', p: 1, ml: 1, minWidth: '30px', maxHeight: '20px' }}><UndoIcon/></Button>
                            <Button variant="contained" sx={{ marginLeft: 'auto', p: 1, ml: 1, minWidth: '30px', maxHeight: '20px' }}><RedoIcon/></Button>
                            <Button variant="contained" component="label" sx={{ marginLeft: 'auto', p: 1, ml: 1, minWidth: '30px', maxHeight: '20px' }}>
                                <CloudUploadIcon/>
                                <input hidden accept="image/*" multiple type="file" onChange={handleTilesetUpload}/>
                            </Button>
                            <Button variant="contained" sx={{ marginLeft: 'auto', p: 1, ml: 1, minWidth: '30px', maxHeight: '20px' }}><AddIcon/></Button>
                        </Toolbar>
                    </Grid>

                    <Grid md={10} component={Paper} elevation={6} square>
                    </Grid>

                </Grid>
            </Container>
        </ThemeProvider>
    );
}