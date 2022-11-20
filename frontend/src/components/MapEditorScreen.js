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

    const [SIZE_OF_CROP, setCropSize] = useState(32)
    const handleChangeCropSize = (e) => {
        e.preventDefault();

        const newCropSize = new FormData(e.currentTarget).get("cropSize");

        setCropSize(newCropSize)
    }

    const [EDITOR_HEIGHT, setEditorHeight] = useState(1024)
    const handleChangeEditorHeight = (e) => {
        e.preventDefault();

        const newHeight = new FormData(e.currentTarget).get("editorHeight");

        setEditorHeight(newHeight)
    }

    const [EDITOR_WIDTH, setEditorWidth] = useState(1024)
    const handleChangeEditorWidth = (e) => {
        e.preventDefault();

        const newWidth = new FormData(e.currentTarget).get("editorWidth");

        setEditorWidth(newWidth)
    }

    function getCoords(e) {
        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        return [Math.floor(x / SIZE_OF_CROP), Math.floor(y / SIZE_OF_CROP)];
    }

    const handleAddTile = (e) => {
        const coords = getCoords(e)
        let x = coords[0]
        let y = coords[1]
        let ctx = e.target.getStage().children[0].canvas.context
        ctx.drawImage(
            tilesetSelected[1], 
            tileSelected[0] * SIZE_OF_CROP, 
            tileSelected[1] * SIZE_OF_CROP, 
            SIZE_OF_CROP, 
            SIZE_OF_CROP,
            x * SIZE_OF_CROP,
            y * SIZE_OF_CROP,
            SIZE_OF_CROP,
            SIZE_OF_CROP
        );
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

    let editorGrid = []
                    
    for (let i = 0; i < EDITOR_WIDTH/SIZE_OF_CROP; i++) {
        for (let j = 0; j < EDITOR_HEIGHT/SIZE_OF_CROP; j++) {
            editorGrid.push(<Rect
                x={i * SIZE_OF_CROP}
                y={j * SIZE_OF_CROP}
                width={SIZE_OF_CROP}
                height={SIZE_OF_CROP}
                fill="transparent"
                stroke="black"
            />)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container disableGutters maxWidth={false} maxHeight={false} sx={{ width: "75%", height: "50%" }}>
                <Container maxWidth={false} disableGutters sx={{ width: "100%", mt: 4, pt: 2, border: 1, backgroundColor: "#DDD2FF" }}>
                    <Toolbar sx={{ mt: -1.5, justifyContent: "center" }}>
                        <Typography variant="h3" color="inherit" noWrap align="center" sx={{ ml: 3 }}>
                            {store.currentMapEdit.name}
                        </Typography>
                        <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, display: "block", marginLeft: "auto" }}>Share</Button>
                        <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Save</Button>
                        <Link to='/personal' style={{ textDecoration: 'none'}}><Button sx={{ backgroundColor: "#CCBBFF", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Exit</Button></Link>
                    </Toolbar>

                        
                    <Toolbar disableGutters sx={{ mt: 0, borderTop: 1, borderBottom: 1 }}>
                        <Button sx={{ display: "block" }}><PanToolIcon/></Button>

                        <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block" }}><LayersIcon/></Button>
                        <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block"}}><FormatColorFillIcon/></Button>
                        <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block"}}><LayersClearIcon/></Button>

                        <Box component="form" onSubmit={handleChangeCropSize} noValidate sx={{ m: 1 }}>
                                <TextField
                                // sx={{ width: '50%' }}
                                size="small"
                                name="cropSize"
                                label={"Crop size: " + SIZE_OF_CROP}
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
                                // sx={{ width: '50%' }}
                                size="small"
                                name="editorWidth"
                                label={"Width: " + SIZE_OF_CROP}
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
                                // sx={{ width: '50%' }}
                                size="small"
                                name="editorHeight"
                                label={"Height: " + SIZE_OF_CROP}
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
                                        x={tileSelected[0] * SIZE_OF_CROP}
                                        y={tileSelected[1] * SIZE_OF_CROP}
                                        width={SIZE_OF_CROP}
                                        height={SIZE_OF_CROP}
                                        fill="transparent"
                                        stroke="black"
                                    />
                                </Layer>
                            </Stage>                 
                        </Grid>

                        <Stage onClick={handleAddTile} width={EDITOR_WIDTH} height={EDITOR_HEIGHT} style={{ overflow: "auto", backgroundColor: "white", marginLeft: "30px", width: "65%", maxHeight: '60vh' , border: '3px solid black'}}>
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