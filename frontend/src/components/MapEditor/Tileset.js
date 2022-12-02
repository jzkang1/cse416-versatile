import React from 'react';
import { useRef, useEffect, useContext, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import AuthContext from "../../auth";
import GlobalStoreContext from "../../store";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LayersClearIcon from '@mui/icons-material/LayersClear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Stage, Layer, Text, Image, Rect } from 'react-konva';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SelectInput from '@mui/material/Select/SelectInput';
import MapEditor from './Map'

const theme = createTheme({
    palette: {
        primary: { main: "#002956" },
        background: { default: "#69C6DE" },
    },
});

export default function MapEditorScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    
    let { id } = useParams();
    
    let [mapName, setMapName] = useState(null)
    const [TILE_HEIGHT, setTileHeight] = useState(32)
    const [TILE_WIDTH, setTileWidth] = useState(32)
    const [EDITOR_HEIGHT, setEditorHeight] = useState(1024)
    const [EDITOR_WIDTH, setEditorWidth] = useState(1024)
    
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorTilesetList, setAnchorTilesetList] = useState(null);
    
    const [isDeleting, setIsDeleting] = useState(false)
    const [tilesetSelected, setTilesetSelected] = useState([-1, null]);
    const [tileSelected, setTileSelected] = useState([0, 0]);
    const [MAP_LAYERS, setMapLayers] = useState([])
    
    const stageRef = useRef(null);
    const editorRef = useRef(null);
    
    useEffect(() => {
        store.loadMapEdit(id).then((map) => {
            setMapName(map.name)
            setTileHeight(map.tileHeight)
            setTileWidth(map.tileWidth)
            setEditorHeight(map.height)
            setEditorWidth(map.width)
            setMapLayers(map.layers)
        });
        
    }, []);

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
            setTileSelected([0, 0])
            setAnchorTilesetList(null)
        };
    }

    const handleTileClick = (e) => {
        setTileSelected(getCoords(e))
    }

    function getCoords(e) {
        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        return [Math.floor(x / TILE_WIDTH), Math.floor(y / TILE_HEIGHT)];
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
        <Grid container sx={{ maxHeight: '62vh', width: "25%" }}>
            <Button
                sx={{ width: "100%" }}
                size="small"
                variant="contained"
                disableElevation
                onClick={handleOpenTilesetList}
                endIcon={<KeyboardArrowDownIcon />}
            >Tilesets</Button>
            <Menu
                sx={{ mt: "28px" }}
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
                        
            <Stage width={tilesetSelected[1]?.width} height={tilesetSelected[1]?.height} style={{ overflow: "auto", backgroundColor: "lightgray", width: "100%", height: "90%" }}>
                <Layer onClick={handleTileClick} style={{ backgroundColor: "yellow" }}>
                    <Image image={tilesetSelected[0] >= 0 ? tilesetSelected[1] : ""} x={0} y={0} style={{ backgroundColor: "yellow" }}></Image>
                    <Rect
                        x={tileSelected[0] * TILE_WIDTH}
                        y={tileSelected[1] * TILE_HEIGHT}
                        width={TILE_WIDTH}
                        height={TILE_HEIGHT}
                        fill="transparent"
                        stroke="black"
                    />
                </Layer>
            </Stage>  

            <Container disableGutters alignItems="center" sx={{ }}>
                <Button variant="contained" component="label" sx={{ ml: 1, width: '30%', maxHeight: '20px' }}>
                    <EditIcon/>
                </Button>
                <Button variant="contained" component="label" sx={{ ml: 1, width: '30%', maxHeight: '20px' }}>
                    <CloudUploadIcon/>
                    <input hidden accept="image/*" multiple type="file" onChange={handleTilesetUpload}/>
                </Button>
                <Link to='/tileEditor'>
                    <Button variant="contained" sx={{ ml: 1, width: '30%', maxHeight: '20px' }}><AddIcon/></Button>
                </Link>
            </Container>               
        </Grid>
    );
}