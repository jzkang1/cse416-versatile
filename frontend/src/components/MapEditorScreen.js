import React from 'react';
import { useRef, useEffect, useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
    
    useEffect(() => {
        store.loadMapEdit(id).then((map) => {
            setMapName(map.name)
            setTileHeight(map.tileHeight)
            setTileWidth(map.tileWidth)
            setEditorHeight(map.height)
            setEditorWidth(map.width)
            setMapLayers(map.layers)
            // handleRenderTile()
        });
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

    const [tilesetSelected, setTilesetSelected] = useState([-1, null]);
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

    const [tileSelected, setTileSelected] = useState([0, 0]);
    const handleTileClick = (e) => {
        setTileSelected(getCoords(e))
    }

    const [TILE_HEIGHT, setTileHeight] = useState(32)
    const [TILE_WIDTH, setTileWidth] = useState(32)
    const [EDITOR_HEIGHT, setEditorHeight] = useState(1024)
    const [EDITOR_WIDTH, setEditorWidth] = useState(1024)
    const handleChangeTileHeight = (e) => {
        e.preventDefault();
        const newTileHeight = new FormData(e.currentTarget).get("tileHeight");
        setTileHeight(Number(newTileHeight))
    }

    const handleChangeTileWidth = (e) => {
        e.preventDefault();
        const newTileWidth = new FormData(e.currentTarget).get("tileWidth");
        setTileWidth(Number(newTileWidth))
    }

    const handleChangeEditorHeight = (e) => {
        e.preventDefault();
        const newHeight = new FormData(e.currentTarget).get("editorHeight");
        setEditorHeight(Number(newHeight))
    }

    const handleChangeEditorWidth = (e) => {
        e.preventDefault();
        const newWidth = new FormData(e.currentTarget).get("editorWidth");
        setEditorWidth(Number(newWidth))
    }

    const [MAP_LAYERS, setMapLayers] = useState([])

    function getCoords(e) {
        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        return [Math.floor(x / TILE_WIDTH), Math.floor(y / TILE_HEIGHT)];
    }  

    const handleAddTile = (e) => {
        const coords = getCoords(e)
        let x = coords[0]
        let y = coords[1]

        console.log("TILE: ", tileSelected)
        console.log("MAP: ", x, y)
        
        let newMap = [...MAP_LAYERS]
        newMap[x][y] = [tilesetSelected[0], tileSelected[0], tileSelected[1]]
        setMapLayers(newMap)
    }

    const stageRef = useRef(null);

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

            store.createTileset(store.currentMapEdit._id, filename, imageString);
        }
        reader.readAsDataURL(file);
    }

    const onKeyEnter = (e) => {
        if (e.key === "Enter") {
          console.log('Input value', e.target.value);
          setMapName(e.target.value);
          
          e.preventDefault();
        }
      }

    if (!store.currentMapEdit) {
        return null;
    }

    
    let editorGrid = []
    if (stageRef.current) {
                    
        for (let i = 0; i < MAP_LAYERS.length; i++) {
            for (let j = 0; j < MAP_LAYERS[i].length; j++) {
                editorGrid.push(<Rect
                    x={i * TILE_WIDTH}
                    y={j * TILE_HEIGHT}
                    width={TILE_WIDTH}
                    height={TILE_HEIGHT}
                    fill="transparent"
                    stroke="black"
                />)
            }
        }

        console.log(MAP_LAYERS)
        let ctx = stageRef.current.children[0].canvas.context

        for (let i = 0; i < MAP_LAYERS.length; i++) {
            for (let j = 0; j < MAP_LAYERS[i].length; j++) {
                let tilesetIndex = MAP_LAYERS[i][j][0]
                if (tilesetIndex >= 0) {
                    const image = new window.Image();
                    image.src = store.currentMapEdit.tilesets[tilesetIndex].data;

                    image.onload = () => {
                        ctx.drawImage(
                            image, 
                            MAP_LAYERS[i][j][1] * TILE_WIDTH, 
                            MAP_LAYERS[i][j][2] * TILE_HEIGHT, 
                            TILE_WIDTH, 
                            TILE_HEIGHT,
                            i * TILE_WIDTH,
                            j * TILE_HEIGHT,
                            TILE_WIDTH,
                            TILE_HEIGHT
                        );
                    };
                    
                }
            }
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container disableGutters maxWidth={false} maxHeight={false} sx={{ width: "75%", height: "50%" }}>
                <Container maxWidth={false} disableGutters sx={{ width: "100%", mt: 4, pt: 2, border: 1, backgroundColor: "#DDD2FF" }}>
                    <Toolbar sx={{ mt: -1.5, justifyContent: "center" }}>
                        <TextField 
                            label= {mapName}
                            onKeyPress={onKeyEnter}
                            sx={{ ml: 3 }}>
                        </TextField>
                        <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, display: "block", marginLeft: "auto" }}>Share</Button>
                        <Button onClick={handleSave} sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Save</Button>
                        <Link to='/personal' style={{ textDecoration: 'none'}}><Button sx={{ backgroundColor: "#CCBBFF", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Exit</Button></Link>
                    </Toolbar>

                        
                    <Toolbar disableGutters sx={{ mt: 0, borderTop: 1, borderBottom: 1 }}>
                        <Button sx={{ display: "block" }}><PanToolIcon/></Button>

                        <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block" }}><LayersIcon/></Button>
                        <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block"}}><FormatColorFillIcon/></Button>
                        <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block"}}><LayersClearIcon/></Button>

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
                
                <Container maxWidth={false} disableGutters sx={{ width: "100%",  border: 1, backgroundColor: "#DDD2FF" }}>
                    
                    <Grid container component="main" sx={{ minHeight: '65vh' }}>
                        <Stack container spacing={1} alignItems="center" sx={{ maxHeight: '60vh', width: "5%" }}>         
                            <Button variant="contained" sx={{ mt: 3, maxWidth: '20px', maxHeight: '20px' }}><UndoIcon/></Button>
                            <Button variant="contained" sx={{ maxWidth: '20px', maxHeight: '20px' }}><RedoIcon/></Button>
                            <Button variant="contained" component="label" sx={{ maxWidth: '20px', maxHeight: '20px' }}>
                                <CloudUploadIcon/>
                                <input hidden accept="image/*" multiple type="file" onChange={handleTilesetUpload}/>
                            </Button>
                            <Link to='/tileEditor'>
                                <Button variant="contained" sx={{ maxWidth: '20px', maxHeight: '20px' }}><AddIcon/></Button>
                            </Link>
                        </Stack>

                        <Grid container sx={{ maxHeight: '60vh', width: "25%" }}>
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

                            <Stage width={tilesetSelected[1]?.width} height={tilesetSelected[1]?.height} style={{ overflow: "auto", backgroundColor: "lightgray", width: "100%", height: "95%" }}>
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
                        </Grid>

                        <Stage onClick={handleAddTile} width={EDITOR_WIDTH} height={EDITOR_HEIGHT} ref={stageRef} style={{ overflow: "auto", backgroundColor: "white", marginLeft: "30px", width: "65%", maxHeight: '60vh' , border: '3px solid black'}}>
                            <Layer>
                                {editorGrid.map((rect) => rect )}
                            </Layer>
                        </Stage>

                    </Grid>
                </Container>
            </Container>
            
        </ThemeProvider>
    );
}