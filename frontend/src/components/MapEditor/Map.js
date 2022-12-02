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

    const handleToggleIsDeleting = (e) => { 
        setIsDeleting(!isDeleting)
    }

    const renderMap = (context) => {
        const loadImage = (src) =>
            new Promise((resolve, reject) => {
            const img = new window.Image();
            img.src = src.data;
            img.onload = () => resolve(img);
            img.onerror = reject;
            
            })  

        Promise.all(store.currentMapEdit.tilesets.map(loadImage)).then(images => {
            let ctx = context ? context : editorRef.current.canvas.context
            for (let i = 0; i < MAP_LAYERS.length; i++) {
                for (let j = 0; j < MAP_LAYERS[i].length; j++) {
                    let tilesetIndex = MAP_LAYERS[i][j][0]
                    if (tilesetIndex >= 0) {
                        ctx.drawImage(
                            images[tilesetIndex], 
                            MAP_LAYERS[i][j][1] * TILE_WIDTH, 
                            MAP_LAYERS[i][j][2] * TILE_HEIGHT, 
                            TILE_WIDTH, 
                            TILE_HEIGHT,
                            i * TILE_WIDTH,
                            j * TILE_HEIGHT,
                            TILE_WIDTH,
                            TILE_HEIGHT
                        );
                        
                    }
                }
            }
        })
    }

    const loadRef = useCallback(node => {
        console.log("TRIGGEREd", editorRef, store.currentMapEdit, node)
        if (node) {
            setMapLayers(MAP_LAYERS)
            renderMap(node.canvas.context)
        }
    });

    if (!store.currentMapEdit) {
        return null;
    }

    const renderGridLines = () => {
        let gridLines = []
        for (let i = 0; i < MAP_LAYERS.length; i++) {
            for (let j = 0; j < MAP_LAYERS[i].length; j++) {
                gridLines.push(<Rect
                    x={i * TILE_WIDTH}
                    y={j * TILE_HEIGHT}
                    width={TILE_WIDTH}
                    height={TILE_HEIGHT}
                    fill="transparent"
                    stroke="black"
                />)
            }
        }
        return gridLines
    }

    let gridLines = renderGridLines()

    let isMouseDown = false

    const handleMouseDown = (e) => { 
        isMouseDown = true 
        handleAddTile(e)
    }

    const handleMouseUp = (e) => { isMouseDown = false }

    function getCoords(e) {
        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        return [Math.floor(x / TILE_WIDTH), Math.floor(y / TILE_HEIGHT)];
    }  

    const handleAddTile = (e) => {
        if (!isMouseDown ) return
        const coords = getCoords(e)
        let x = coords[0]
        let y = coords[1]

        let ctx = editorRef.current.canvas.context
        let newMap = MAP_LAYERS
        if (isDeleting) {
            ctx.clearRect(x * TILE_WIDTH,y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            newMap[x][y] = [-1, -1, -1]
        } else {
            if (tilesetSelected[0] == -1) return
            ctx.drawImage(
                tilesetSelected[1], 
                tileSelected[0] * TILE_WIDTH, 
                tileSelected[1] * TILE_HEIGHT, 
                TILE_WIDTH, 
                TILE_HEIGHT,
                x * TILE_WIDTH,
                y * TILE_HEIGHT,
                TILE_WIDTH,
                TILE_HEIGHT
            );
            newMap[x][y] = [tilesetSelected[0], tileSelected[0], tileSelected[1]]
        }
        setMapLayers(newMap)
    }

    let deleteButton = <Button onClick={handleToggleIsDeleting} sx={{ ml: 1, borderRadius: '0px', display: "block"}}><LayersClearIcon/></Button>
    if (isDeleting) {
        deleteButton = <Button onClick={handleToggleIsDeleting} variant="contained" sx={{ ml: 1, borderRadius: '0px', display: "block"}}><LayersClearIcon/></Button>
    }

    return (
        <Stage onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleAddTile} width={EDITOR_WIDTH} height={EDITOR_HEIGHT} ref={stageRef} style={{ overflow: "auto", backgroundColor: "white", marginLeft: "30px", width: "60%", maxHeight: '62vh' , border: '3px solid black'}}>
            <Layer ref={loadRef}>
                {gridLines.map((rect) => rect )}
            </Layer>
            <Layer ref={editorRef}>
                {/* {loadRef(this)} */}
            </Layer>
        </Stage>
    );
}