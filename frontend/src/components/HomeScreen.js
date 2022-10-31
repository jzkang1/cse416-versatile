import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: "#002956"
      },
      background: {
        default: "#69C6DE"
      }
    }
  });

export default function HomeScreen() {
    return (
        <ThemeProvider theme={theme}>
            <img src={require("../images/homescreenLogo.png")}/>
        </ThemeProvider>
    )
}