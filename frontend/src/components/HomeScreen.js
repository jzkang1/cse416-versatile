import Box from '@mui/material/Box';

export default function HomeScreen() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <img src={require("../images/homescreenLogo.png")} width={false} height={false}/>
        </Box>
    )
}