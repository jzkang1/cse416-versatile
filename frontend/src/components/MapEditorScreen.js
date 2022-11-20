import React from 'react';
import { useRef, useEffect, useContext, useState } from "react";
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
import EditIcon from '@mui/icons-material/Edit';
import { Stage, Layer, Text, Image, Rect } from 'react-konva';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
const TILESET_HEIGHT = 512
const TILESET_WIDTH = 239
const theme = createTheme({
    palette: {
        primary: { main: "#002956" },
        background: { default: "#69C6DE" },
    },
});

function URLImage(props) {
    const [image, setImage] = useState(null);
    
    useEffect(() => {
        loadImage();
    }, [props.src]);
    
    function loadImage() {
        if (props.src) {
            const image = new window.Image();
            image.src = props.src;

            image.onload = () => {
                setImage(image);
            };
        }
    }
    return (
        <Image image={image} x={props.x} y={props.y}></Image>
    );
}

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

    const [anchorTilesetList, setAnchorTilesetList] = useState(null);

    const handleOpenTilesetList = (event) => {
        setAnchorTilesetList(event.currentTarget);
    };

    const handleCloseTilesetList = () => {
        setAnchorTilesetList(null);
    };

    const handleTilesetClick = (e, tilesetId) => {
        let index = tilesetId
        const image = new window.Image();
        image.src = store.currentMapEdit.tilesets[index].data;

        image.onload = () => {
            setTilesetSelected([index, image])
        };
    }

    const [tilesetSelected, setTilesetSelected] = useState([-1, null]);
    const [tileSelected, setTileSelected] = useState([0, 0]);

    function getCoords(e) {
        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        return [Math.floor(x / 32), Math.floor(y / 32)];
    }

    const handleAddTile = (e) => {
        const coords = getCoords(e)
        let x = coords[0]
        let y = coords[1]
        let ctx = e.target.getStage().children[0].canvas.context
        const size_of_crop = 32
        ctx.drawImage(
            tilesetSelected[1], 
            tileSelected[0] * size_of_crop, 
            tileSelected[1] * size_of_crop, 
            size_of_crop, 
            size_of_crop,
            x * size_of_crop,
            y * size_of_crop,
            size_of_crop,
            size_of_crop
        );
    }

    const handleTileClick = (e) => {
        setTileSelected(getCoords(e))
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

    if (!store.currentMapEdit) {
        return null;
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
                    <Link to='/personal' style={{ textDecoration: 'none'}}><Button sx={{ backgroundColor: "#CCBBFF", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Exit</Button></Link>
                </Toolbar>

                    
                <Toolbar disableGutters sx={{ mt: 0, borderTop: 1, borderBottom: 1 }}>
                    <Button sx={{ display: "block" }}><PanToolIcon/></Button>
                    <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block" }}><PanToolAltIcon/></Button>
                    <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block" }}><LayersIcon/></Button>
                    <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block"}}><FormatColorFillIcon/></Button>
                    <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block"}}><LayersClearIcon/></Button>
                    <Button onClick={handleOpenTilesetList} sx={{ borderLeft: 1, borderRadius: '0px', display: "block"}}>Tilesets</Button>
                    <Menu
                        sx={{ mt: "36px" }}
                        id="menu-appbar"
                        anchorEl={anchorTilesetList}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        open={Boolean(anchorTilesetList)}
                        onClose={handleCloseTilesetList}
                    >
                    
                        <MenuList sx={{ width: 320, maxWidth: '100%' }}>
                            {store.currentMapEdit.tilesets?.map((tileset, i) => (
                                <MenuItem onClick={(event) => handleTilesetClick(event, i)}sx={{ width: '100%'}}>
                                     <ListItemText>
                                         {tileset.name}
                                     </ListItemText>
                                </MenuItem>
                            ))}
                
                            
                        </MenuList>
                    </Menu>

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
                        <Stage width={TILESET_WIDTH} height={TILESET_HEIGHT} style={{ backgroundColor: "gray", width: "100%", height: "95%" }}>
                            <Layer onClick={handleTileClick}>
                                <URLImage src={tilesetSelected[0] >= 0 ? store.currentMapEdit.tilesets[tilesetSelected[0]].data : ""}/>
                                <Rect
                                    x={tileSelected[0] * 32}
                                    y={tileSelected[1] * 32}
                                    width={32}
                                    height={32}
                                    fill="transparent"
                                    stroke="black"
                                />
                            </Layer>
                        </Stage>
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

                    <Stage onClick={handleAddTile} width={830} height={510} style={{ backgroundColor: "white", marginLeft: "60px", marginTop:'15px', width: "70%", height: '520px' , border: '3px solid black'}}>
                        <Layer>
                            <Text text="Map" />
                        </Layer>
                    </Stage>

                </Grid>
            </Container>
        </ThemeProvider>
    );
}