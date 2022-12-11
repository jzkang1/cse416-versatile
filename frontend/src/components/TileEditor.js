import React from 'react';
import { useRef, useEffect, useContext, useState } from "react";
import GlobalStoreContext from "../store";
import { Link, useParams } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PanToolIcon from '@mui/icons-material/PanTool';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import LayersIcon from '@mui/icons-material/Layers';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import EditOffIcon from '@mui/icons-material/EditOff';
import EditIcon from '@mui/icons-material/Edit';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Stage, Layer, Line, Text, Image, Rect } from 'react-konva';
import { FormControlUnstyledContext } from '@mui/base';


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

export default function TileEditor() {
    const { store } = useContext(GlobalStoreContext);
    const [tool, setTool] = React.useState('pen');
    const [lines, setLines] = React.useState([]);
    const [redoStack, setRedoStack] = React.useState([]);
    const isDrawing = React.useRef(false);

    const [tilesetName, setTilesetName] = useState("Untitled");
    const stageRef = useRef(null);

    const [tileset, setTileset] = useState(null);
    const [color, setColor] = useState("#aabbcc");
    const [strokeWidth, setStrokeWidth] = useState(5);

    let { id, tilesetSelected, gridWidth, gridHeight } = useParams();

    useEffect(() => {
        if (id) {
            store.loadMapEdit(id).then((map) => {
                let ctx = stageRef.current.children[0].canvas.context

                const img = new window.Image();
                img.src = store.currentMapEdit.tilesets[tilesetSelected].data;

                img.onload = (e) => {
                    setTileset(img)
                }
            });
        }
    }, []);

    if (!store.currentMapEdit) {
        return null;
    }

    const handleToggleEraser = () => {
        setTool("eraser")
    }
    
    const handleTogglePen = () => {
        setTool("pen")
    }
    
    const handleStrokeWidth = (e) => {
        e.preventDefault()
        
        const newStrokeWidth = new FormData(e.currentTarget).get("strokeWidth");
        setStrokeWidth(Number(newStrokeWidth))
    }

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        setRedoStack([])
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, color, strokeWidth, points: [pos.x, pos.y] }]);
    };
    
    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };


    const handleSave = () => {
        if (tilesetSelected) {
            console.log("updating")
            const uri = stageRef.current.children[0].canvas.toDataURL();

            let img = new window.Image();
            img.src = uri;

            img.onload = function () {
                store.updateTileset(store.currentMapEdit._id, tilesetSelected, tilesetName, uri);
            };
        } else {
            const uri = stageRef.current.children[0].canvas.toDataURL();
    
            let img = new window.Image();
            img.src = uri;
    
            img.onload = function () {
                console.log(img.height, img.width)
                store.createTileset(store.currentMapEdit._id, tilesetName, uri, img.height, img.width);
            };
        }
    }

    const renderGridLines = () => {
        let gridLines = []
        for (let i = 0; i < 600/gridWidth; i++) {
            for (let j = 0; j < 600/gridHeight; j++) {
                gridLines.push(<Rect
                    x={i * gridWidth}
                    y={j * gridHeight}
                    width={gridWidth}
                    height={gridHeight}
                    fill="transparent"
                    stroke="black"
                />)
            }
        }
        return gridLines
    }

    const handleUndo = () => {
        console.log("Undo")
        if (lines.length > 0) {
            let newRedoStack = [...redoStack]
            newRedoStack.push(lines[lines.length-1])
            setRedoStack(newRedoStack)
            setLines(lines.slice(0, lines.length-1))
        }
    }

    const handleRedo = () => {
        console.log("Redo")
        console.log(redoStack, redoStack.length)
        if (redoStack.length > 0) {
            let newLines = [...lines]
            newLines.push(redoStack[0])
            setLines(newLines)
            setRedoStack(redoStack.slice(1, redoStack.length))
        }
    }

    let gridLines = renderGridLines()

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth={false} maxHeight={false} sx={{ width: "70%", height: "50%" }}>
                <Container maxWidth={false} disableGutters sx={{ width: "100%", mt: 4, border: 1, backgroundColor: "#DDD2FF" }}>


                    <Toolbar disableGutters sx={{ mt: 0, borderTop: 1, borderBottom: 1 }}>
                        <TextField
                            id="outlined-helperText"
                            label="Tileset Name"
                            defaultValue={tilesetName}
                            onChange={(newValue) => setTilesetName(newValue.target.value)}
                        />
                        <Button onClick={handleSave} sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Save</Button>
                        <Link to={`/editor/${store.currentMapEdit._id}`} style={{ textDecoration: 'none' }}><Button sx={{ backgroundColor: "#CCBBFF", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Exit</Button></Link>
                    </Toolbar>

                    <Grid container display="flex">
                        <Stage width={600} height={600} ref={stageRef}
                            onMouseDown={handleMouseDown}
                            onMousemove={handleMouseMove}
                            onMouseup={handleMouseUp}
                            style={{ overflow: "auto", backgroundColor: "white", border: '3px solid black', width: "40%", height: "100%" }}>
                            <Layer>
                                <Image image={tileset ? tileset : ""} x={0} y={0} style={{ backgroundColor: "yellow" }}></Image>

                                {lines.map((line, i) => (
                                    <Line
                                    key={i}
                                    points={line.points}
                                    stroke={line.color}
                                        strokeWidth={line.strokeWidth}
                                        tension={0}
                                        lineCap="square"
                                        lineJoin="round"
                                        globalCompositeOperation={
                                            line.tool === 'eraser' ? 'destination-out' : 'source-over'
                                        }
                                        />
                                ))}
                            </Layer>
                            <Layer>
                                {gridLines.map((rect) => rect)}
                            </Layer>
                        </Stage>

                        <Grid height={500} width={500} sx={{ ml: 5, mt: 5 }}>

                            <Container disableGutters alignItems="center" sx={{}}>
                                <Button variant="contained" sx={{ ml: 1, width: '33%', maxHeight: '20px' }} onClick={handleTogglePen}>
                                    <EditIcon />
                                </Button>
                                <Button variant="contained" component="label" sx={{ ml: 1, width: '33%', maxHeight: '20px' }} onClick={handleToggleEraser}>
                                    <EditOffIcon />
                                </Button>

                                <Button variant="contained" component="label" sx={{ ml: 1, width: '33%', maxHeight: '20px' }} onClick={handleUndo}>
                                    <UndoIcon />
                                </Button>
                                <Button variant="contained" component="label" sx={{ ml: 1, width: '33%', maxHeight: '20px' }} onClick={handleRedo}>
                                    <RedoIcon />
                                </Button>
                            </Container>

                            <Box component="form" onSubmit={handleStrokeWidth} noValidate sx={{ m: 1 }}>
                                <TextField
                                    size="small"
                                    name="strokeWidth"
                                    label={`Stroke Width: ${strokeWidth}`}
                                    InputProps={{
                                        endAdornment: (
                                            <Button type="submit" fullWidth variant="contained" sx={{ m: 1, width: '5%' }}>
                                                Enter
                                            </Button>
                                        )
                                    }} />
                            </Box>

                            <Grid height={300} width={500}>
                                <HexColorInput style={{ width: "100%" }} color={color} onChange={setColor} />
                                <HexColorPicker style={{ width: "100%", height: "100%" }} color={color} onChange={setColor} ></HexColorPicker>

                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Container>
        </ThemeProvider >
    );
}