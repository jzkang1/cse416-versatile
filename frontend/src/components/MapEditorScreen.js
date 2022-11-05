import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext, useState } from "react";
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import FavoriteIcon from '@mui/icons-material/Favorite';
import Avatar from "@mui/material/Avatar";
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

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

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

export default function Album() {
    const [anchorElUser, setAnchorElUser] = useState(null);//(React.useState < null) | (HTMLElement > null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
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
                        {cards.map((card) => (
                            <Grid item key={card} md={4} sx={{ p: 1}}>
                                <Card sx={{ height: '50px', width: '5, 0px' }}>
                                    <CardMedia component="img" image="https://source.unsplash.com/random" sx={{ height: '50px'}}/>
                                </Card>
                            </Grid>
                        ))}
                        <Toolbar disableGutters sx={{ mt: 0, borderTop: 1 }}>
                            <Button variant="contained" sx={{ marginLeft: 'auto', p: 1, ml: 1, minWidth: '30px', maxHeight: '20px' }}><UndoIcon/></Button>
                            <Button variant="contained" sx={{ marginLeft: 'auto', p: 1, ml: 1, minWidth: '30px', maxHeight: '20px' }}><RedoIcon/></Button>
                            
                            <Button variant="contained" sx={{ marginLeft: 'auto', p: 1, ml: 1, minWidth: '30px', maxHeight: '20px' }}><CloudUploadIcon/></Button>
                            <Button variant="contained" sx={{ marginLeft: 'auto', p: 1, ml: 1, minWidth: '30px', maxHeight: '20px' }}><AddIcon/></Button>
                        </Toolbar>
                    </Grid>

                    <Grid md={10} component={Paper} elevation={6} square>
                        {/* MAP EDITOR GOES HERE */}
                    </Grid>

                </Grid>
            </Container>
        </main>
        </ThemeProvider>
    );
}