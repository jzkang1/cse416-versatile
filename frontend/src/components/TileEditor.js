import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import LC from "literallycanvas";
import "../literallycanvas/css/literallycanvas.css"

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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ pt: 4 }}>
                <Box>
                    <LC.LiterallyCanvasReactComponent imageURLPrefix="../src/literallycanvas/img" />
                </Box>
            </Container>
        </ThemeProvider>
    );
}