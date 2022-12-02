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
import { IconButton } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import MapSection from './Map'
import TilesetSection from './Tileset'

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
    const [selectedLayer, setSelectedLayer] = useState(0)

    const stageRef = useRef(null);
    const editorRef = useRef(null);

    const renderMap = () => {
        const loadImage = (src) =>
            new Promise((resolve, reject) => {
            const img = new window.Image();
            img.src = src.data;
            img.onload = () => resolve(img);
            img.onerror = reject;
            
            })  

        Promise.all(store.currentMapEdit.tilesets.map(loadImage)).then(images => {
            for (let layerI = 0; layerI < MAP_LAYERS.length; layerI++) { 
                let ctx = stageRef.current.children[layerI+1].canvas.context
                for (let i = 0; i < MAP_LAYERS[layerI].length; i++) {
                    for (let j = 0; j < MAP_LAYERS[layerI][i].length; j++) {
                        let tilesetIndex = MAP_LAYERS[layerI][i][j][0]
                        if (tilesetIndex >= 0) {
                            ctx.drawImage(
                                images[tilesetIndex], 
                                MAP_LAYERS[layerI][i][j][1] * TILE_WIDTH, 
                                MAP_LAYERS[layerI][i][j][2] * TILE_HEIGHT, 
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
            }
        })
    }
    
    useEffect(() => {
        store.loadMapEdit(id).then((map) => {
            setMapName(map.name)
            setTileHeight(map.tileHeight)
            setTileWidth(map.tileWidth)
            setEditorHeight(map.height)
            setEditorWidth(map.width)
            setMapLayers(map.layers)
        });
        
        return function cleanup() {
            store.endEditMap(id);
        }
    }, []);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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

    const handleChangeTileHeight = (e) => {
        e.preventDefault();
        const newTileHeight = new FormData(e.currentTarget).get("tileHeight");
        setTileHeight(Number(newTileHeight))
        renderMap()
    }

    const handleChangeTileWidth = (e) => {
        e.preventDefault();
        const newTileWidth = new FormData(e.currentTarget).get("tileWidth");
        setTileWidth(Number(newTileWidth))
        renderMap()
    }

    const handleChangeEditorHeight = (e) => {
        e.preventDefault();
        let newHeight = Math.max(TILE_HEIGHT, Number(new FormData(e.currentTarget).get("editorHeight")));
        
        if (!Number.isInteger(newHeight/TILE_HEIGHT)) {
            newHeight = TILE_HEIGHT * Math.floor(newHeight/TILE_HEIGHT)
        }

        let newLayers = MAP_LAYERS;

        if (newHeight/TILE_HEIGHT < MAP_LAYERS[0].length) {
            for (let i = 0; i < newLayers.length; i++) {
                newLayers[i] = newLayers[i].map(row => row.slice(0, newHeight/TILE_HEIGHT))
            }
        } else {
            for (let layeri = 0; layeri < newLayers.length; layeri++) {
                for (let i = 0; i < MAP_LAYERS[layeri].length; i++) {
                    for (let j = MAP_LAYERS[layeri][i].length; j < newHeight/TILE_HEIGHT; j++) {
                        newLayers[layeri][i].push([-1, -1, -1])
                    }
                }
            }
        }
        
        setMapLayers(newLayers)
        setEditorHeight(newHeight)
    }

    const handleChangeEditorWidth = (e) => {
        e.preventDefault();
        let newWidth = Math.max(TILE_WIDTH, Number(new FormData(e.currentTarget).get("editorWidth")));
        
        if (!Number.isInteger(newWidth/TILE_WIDTH)) {
            newWidth = TILE_WIDTH * Math.floor(newWidth/TILE_WIDTH)
        }

        let newLayers = MAP_LAYERS;
        if (newWidth/TILE_WIDTH < MAP_LAYERS[0].length) {
            for (let i = 0; i < newLayers.length; i++) {
                console.log(i)
                newLayers[i] = newLayers[i].slice(0, newWidth/TILE_WIDTH)
            }
        } else {
            for (let layeri = 0; layeri < newLayers.length; layeri++) {
                for (let i = MAP_LAYERS[layeri].length; i < newWidth/TILE_WIDTH; i++) {
                    newLayers[layeri].push([])
                    for (let j = 0; j < newWidth/TILE_HEIGHT; j++) {
                        newLayers[layeri][i].push([-1, -1, -1])
                    }
                }
            }
        }
        
        
        console.log(newLayers)
        setMapLayers(newLayers)
        setEditorWidth(newWidth) 
    }


    function getCoords(e) {
        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        return [Math.floor(x / TILE_WIDTH), Math.floor(y / TILE_HEIGHT)];
    }  

    let isMouseDown = false

    const handleMouseDown = (e) => { 
        isMouseDown = true 
        handleAddTile(e)
    }

    const handleMouseUp = (e) => { isMouseDown = false }

    const handleAddTile = (e) => {
        if (!isMouseDown ) return

        const coords = getCoords(e)
        let x = coords[0]
        let y = coords[1]
        
        let ctx = stageRef.current.children[Number(selectedLayer)+1].canvas.context
        let newMap = MAP_LAYERS
        if (isDeleting) {
            ctx.clearRect(x * TILE_WIDTH,y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            newMap[selectedLayer][x][y] = [-1, -1, -1]
        } else {
            if (tilesetSelected[0] == -1) return
            ctx.clearRect(x * TILE_WIDTH,y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
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
            newMap[selectedLayer][x][y] = [tilesetSelected[0], tileSelected[0], tileSelected[1]]
        }
        setMapLayers(newMap)
    }

    const handleSave = () => {
        const uri = stageRef.current.children[0].canvas.toDataURL();
        let map = store.currentMapEdit;
        map.layers = MAP_LAYERS
        map.name = mapName;
        map.tileHeight = TILE_HEIGHT
        map.tileWidth = TILE_WIDTH
        map.height = EDITOR_HEIGHT
        map.width = EDITOR_WIDTH
        map.thumbnail = uri;
        store.updateMap(map);
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

            let img = new window.Image();
            img.src = event.target.result;

            img.onload = () => {
                store.createTileset(store.currentMapEdit._id, filename, imageString, img.width, img.height);
            }
        }
        reader.readAsDataURL(file);
    }

    const onKeyEnter = (e) => {
        if (e.key === "Enter") { setMapName(e.target.value); }
    }

    const onBlur = (e) => {
        setMapName(e.target.value);
    }

    if (!store.currentMapEdit) {
        return null;
    }

    const renderGridLines = () => {
        let gridLines = []
        for (let i = 0; i < MAP_LAYERS[0].length; i++) {
            for (let j = 0; j < MAP_LAYERS[0][i].length; j++) {
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
    renderMap()

    const handleToggleIsDeleting = (e) => { 
        setIsDeleting(!isDeleting)
    }

    let deleteButton = <Button onClick={handleToggleIsDeleting} sx={{ ml: 1, borderRadius: '0px', display: "block"}}><LayersClearIcon/></Button>
    if (isDeleting) {
        deleteButton = <Button onClick={handleToggleIsDeleting} variant="contained" sx={{ ml: 1, borderRadius: '0px', display: "block"}}><LayersClearIcon/></Button>
    }

    const handleCreateNewLayer = (event) => {
        if (MAP_LAYERS.length >= 5) return
        let newLayers = [...MAP_LAYERS]
        newLayers.push([])
        for (let i = 0; i < EDITOR_WIDTH/TILE_WIDTH; i++) {
            newLayers[newLayers.length-1].push([])
            for (let j = 0; j < EDITOR_HEIGHT/TILE_HEIGHT; j++) {
                newLayers[newLayers.length-1][i].push([-1, -1, -1])
            }
        }
        setMapLayers(newLayers)
    }

    const handleDeleteLayer = (e) => {
        if (MAP_LAYERS.length <= 1) return
        let newLayers = [...MAP_LAYERS]
        newLayers.splice(e.target.id, 1)
        setMapLayers(newLayers)
    }

    const handleMoveLayerUp = (e) => {
        let id = Number(e.target.id)
        if (id == 0) return
        let newLayers = [...MAP_LAYERS]
        let temp = newLayers[id-1]
        newLayers[id-1] = newLayers[id]
        newLayers[id] = temp
        
        console.log("Up: ", id, id-1, newLayers)
        setMapLayers(newLayers)
    }

    const handleMoveLayerDown = (e) => {
        let id = Number(e.target.id)
        if (id == MAP_LAYERS.length-1) return

        let newLayers = [...MAP_LAYERS]
        let temp = newLayers[id+1]
        newLayers[id+1] = newLayers[id]
        newLayers[id] = temp

        console.log("Down: ", id, id+1, newLayers)
        setMapLayers(newLayers)
    }


    const handleSelectLayer = (e) => {
        setSelectedLayer(e.target.id)
    }

    const trigger = () => {
        console.log("MAP_LAYERS: ", MAP_LAYERS, "# OF LAYERS: ", MAP_LAYERS.length)
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container disableGutters maxWidth={window.innerWidth} maxHeight={window.innerHeight} sx={{ width: "75%", height: "50%" }}>
                <Container maxWidth={false} disableGutters sx={{ width: "100%", mt: 4, pt: 2, border: 1, backgroundColor: "#DDD2FF" }}>
                    <Toolbar sx={{ mt: -1.5, justifyContent: "center" }}>
                        <TextField 
                            label= {mapName}
                            onKeyPress={onKeyEnter}
                            onChange={onBlur}
                            sx={{ ml: 3 }}>
                        </TextField>
                        <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, display: "block", marginLeft: "auto" }}>Share</Button>
                        <Button onClick={handleSave} sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Save</Button>
                        <Link to='/personal' style={{ textDecoration: 'none'}}><Button sx={{ backgroundColor: "#CCBBFF", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Exit</Button></Link>
                    </Toolbar>

                        
                    <Toolbar disableGutters sx={{ mt: 0, borderTop: 1, borderBottom: 1 }}>
                        {deleteButton}

                        <Box component="form" onSubmit={handleChangeTileHeight} noValidate sx={{ m: 1 }}>
                                <TextField
                                size="small"
                                name="tileHeight"
                                label={"Tile Height: " + TILE_HEIGHT}
                                InputProps={{
                                    endAdornment: (
                                        <Button type="submit" fullWidth variant="contained" sx={{ m: 1, width: '5%' }}>
                                            Enter
                                        </Button>
                                    )
                                }}/>
                        </Box>

                        <Box component="form" onSubmit={handleChangeTileWidth} noValidate sx={{ m: 1 }}>
                                <TextField
                                size="small"
                                name="tileWidth"
                                label={"Tile Width: " + TILE_WIDTH}
                                InputProps={{
                                    endAdornment: (
                                        <Button type="submit" fullWidth variant="contained" sx={{ m: 1, width: '5%' }}>
                                            Enter
                                        </Button>
                                    )
                                }}/>
                        </Box>

                        <Box component="form" onSubmit={handleChangeEditorWidth} noValidate sx={{ m: 1 }}>
                                <TextField
                                size="small"
                                name="editorWidth"
                                label={"Map Width: " + EDITOR_WIDTH}
                                InputProps={{
                                    endAdornment: (
                                        <Button type="submit" fullWidth variant="contained" sx={{ m: 1, width: '5%' }}>
                                            Enter
                                        </Button>
                                    )
                                }}/>
                        </Box>

                        <Box component="form" onSubmit={handleChangeEditorHeight} noValidate sx={{ m: 1 }}>
                                <TextField
                                size="small"
                                name="editorHeight"
                                label={"Map Height: " + EDITOR_HEIGHT}
                                InputProps={{
                                    endAdornment: (
                                        <Button type="submit" fullWidth variant="contained" sx={{ m: 1, width: '5%' }}>
                                            Enter
                                        </Button>
                                    )
                                }}/>
                        </Box>

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
                
                <Container maxWidth={false} disableGutters sx={{ width: "100%",  border: 1, backgroundColor: "#DDD2FF" }}>
                    
                    <Grid container component="main" sx={{ minHeight: '65vh' }}>
                        <Stack container alignItems="center" sx={{ maxHeight: '62vh', width: "1.5%" }}/>

                        {/* <TilesetSection/>
                        <MapSection/> */}
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

                        <Stage ref={stageRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleAddTile} width={EDITOR_WIDTH} height={EDITOR_HEIGHT} style={{ overflow: "auto", backgroundColor: "white", marginLeft: "30px", width: "57%", maxHeight: '62vh' , border: '3px solid black'}}>
                            <Layer>
                                {gridLines.map((rect) => rect )}
                            </Layer>

                            {MAP_LAYERS.map((obj, i) => {
                                return <Layer id={i}></Layer>
                            })}
                        </Stage>
                        
                        <Box container sx={{ backgroundColor: 'lightgray', maxHeight: '62vh', width: "13%" }}>
                            <Typography sx={{ textAlign: "center", color: "white", backgroundColor: "#002956", width: "100%" }}>
                                Layers
                            </Typography>

                            <MenuList>
                                {MAP_LAYERS.map((obj, i) => {
                                    if (selectedLayer == i) {
                                        return <MenuItem 
                                            disableRipple
                                            sx={{ '&:hover': {backgroundColor: 'yellow'},  backgroundColor: "yellow" }} 
                                            id={i} onClick={handleSelectLayer}>
                                            Layer: {i+1} 
                                            <IconButton size="small">
                                                <RemoveCircleOutlineIcon fontSize="small" id={i} onClick={handleDeleteLayer}/>
                                            </IconButton>
                                            <IconButton size="small">
                                                <KeyboardArrowUpIcon fontSize="small" id={i} onClick={handleMoveLayerUp}/>
                                            </IconButton>
                                            <IconButton size="small">
                                                <KeyboardArrowDownIcon fontSize="small" id={i} onClick={handleMoveLayerDown}/>
                                            </IconButton>
                                            </MenuItem>
                                    } 
                                    return <MenuItem id={i} onClick={handleSelectLayer}>Layer {i+1}</MenuItem>
                                })}
                                <MenuItem onClick={handleCreateNewLayer}>Create New</MenuItem>
                            </MenuList>
                        </Box>
                    </Grid>
                </Container>
            </Container>
            
        </ThemeProvider>
    );
}