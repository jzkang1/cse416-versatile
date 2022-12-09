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

import { Stage, Layer, Line, Text, Image, Rect } from 'react-konva';


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
    const isDrawing = React.useRef(false);

    const [tilesetName, setTilesetName] = useState("Untitled");
    const stageRef = useRef(null);

    let { id, tilesetSelected } = useParams();


    useEffect(() => {
        if (id) {
            store.loadMapEdit(id).then((map) => {
                console.log(store.currentMapEdit)
                console.log(stageRef.current)
                let ctx = stageRef.current.children[0].canvas.context

                const img = new window.Image();
                img.src = store.currentMapEdit.tilesets[tilesetSelected].data;
                img.onload = (e) => {
                    console.log(img)
                    ctx.drawImage(
                        img, 0, 0
                    );
                }
            });
        }
    }, []);

    if (!store.currentMapEdit) {
        return null;
    }
    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
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


    const handleExport = () => {
        const uri = stageRef.current.toDataURL();
        console.log(store.currentMapEdit)
        store.createTileset(store.currentMapEdit._id, tilesetName, uri);
    }

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
                        <Button sx={{ display: "block" }}><PanToolIcon /></Button>
                        <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block" }}><PanToolAltIcon /></Button>
                        <Button sx={{ borderLeft: 1, borderRadius: '0px', display: "block" }}><FormatColorFillIcon /></Button>
                        <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, display: "block", marginLeft: "auto" }}>Export</Button>
                        <Button onClick={handleExport} sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Save</Button>
                        <Link to={`/editor/${store.currentMapEdit._id}`} style={{ textDecoration: 'none' }}><Button sx={{ backgroundColor: "#CCBBFF", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Exit</Button></Link>



                    </Toolbar>
                    <Grid container md={8}>
                        <Stage width={600} height={600} ref={stageRef}
                            onMouseDown={handleMouseDown}
                            onMousemove={handleMouseMove}
                            onMouseup={handleMouseUp}
                            style={{ backgroundColor: "white", border: '3px solid black' }}>
                            <Layer>
                                {lines.map((line, i) => (
                                    <Line
                                        key={i}
                                        points={line.points}
                                        stroke="#df4b26"
                                        strokeWidth={5}
                                        tension={0.5}
                                        lineCap="round"
                                        lineJoin="round"
                                        globalCompositeOperation={
                                            line.tool === 'eraser' ? 'destination-out' : 'source-over'
                                        }
                                    />
                                ))}
                            </Layer>
                        </Stage>
                    </Grid>
                </Container>
            </Container>
        </ThemeProvider>
    );
}