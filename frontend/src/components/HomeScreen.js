import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';

const theme = createTheme({
    palette: {
        primary: {
            main: "#002956",
        },
        background: {
            default: "#69C6DE",
        },
    },
});

export default function HomeScreen() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>

            <Box 
                sx={{ mt: 25 }}
                display="flex" 
                justifyContent="center"
                alignItems="center">
                <img src={require("../images/logo.png")} width='300'/>
            </Box>

            <Box display="flex" 
                justifyContent="center"
                alignItems="center">

                <Typography
                align="center"
                variant="h6"
                noWrap
                component="a"
                sx={{
                    ml: .6,
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontSize: 100,
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "primary.main",
                    textDecoration: "none",
                }}>Versatile</Typography>

            </Box>

        </ThemeProvider>
    )
}