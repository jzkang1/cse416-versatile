import React from 'react';
import { useContext, useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from '@mui/icons-material/Search';
import Modal from '@mui/material/Modal';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Stack from '@mui/material/Stack';

import ShareModal from './ShareModal';
import { Avatar } from '@mui/material';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 400,
    bgcolor: '#69C6DE',
    border: '2px solid #000',
    borderRadius: 8,
    boxShadow: 24,
    p: 4,
};

export default function PersonalScreen() {
    const [anchorElUser, setAnchorElUser] = useState(null);

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
        handleCloseUserMenu();
    }

    const handleClose = () => setOpen(false);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleShareModal = () => {
        setAnchorElUser(null);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <Container maxWidth="lg" sx={{ pt: 4 }}
                >
                    <Typography variant="h3" color="inherit" noWrap align="center">
                        Personal
                    </Typography>
                    <Typography align="center">
                        Manage your maps
                    </Typography>

                    <Toolbar sx={{ borderTop: 1, mt: 3 }}>
                        <Button sx={{ backgroundColor: "#60DBA0", my: 2, borderRadius: '8px', border: 1, borderColor: 'primary.main' }}>
                            <AddCircleIcon sx={{ mr: 1 }} />
                            Create Map
                        </Button>
                        <Button sx={{ backgroundColor: "#CCBBFF", borderRadius: '8px', my: 2, display: "block", marginLeft: "auto" }}>All</Button>
                        <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Owned</Button>
                        <Button sx={{ backgroundColor: "#E0D7FB", borderRadius: '8px', my: 2, ml: 2, display: "block" }}>Shared</Button>
                        <TextField
                            sx={{ ml: 3 }}
                            size="small"
                            label="Search"
                            InputProps={{
                                endAdornment: (
                                    <SearchIcon />
                                )
                            }}
                        />
                    </Toolbar>
                </Container>

                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {cards.map((card) => (
                            <Grid item key={card} xs={12} sm={6} md={4} lg={3}>
                                <Card sx={{ height: '155px', display: 'flex', flexDirection: 'column', borderRadius: '8px' }}>

                                    <Link to='/editor'>
                                        <CardMedia
                                            component="img"
                                            image={require('../images/forest.png')}
                                            sx={{ height: '130px' }}
                                        />
                                    </Link>
                                    
                                    <Container sx={{ pt: .2, height: '25px', backgroundColor: '#F3FFF3', display: 'flex' }}>
                                        <Typography variant="body2">
                                            Green Forest
                                        </Typography>

                                        <Button onClick={handleOpenUserMenu}
                                            variant="contained" sx={{ marginLeft: 'auto', p: 0, minWidth: '30px', maxHeight: '20px' }}>
                                            <MoreVertIcon
                                                fontSize='small'
                                            />
                                        </Button>

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
                                            <MenuItem onClick={handleOpen}>Share</MenuItem>
                                            <MenuItem onClick={handleCloseUserMenu}>Duplicate</MenuItem>
                                            <MenuItem onClick={handleCloseUserMenu}>Delete</MenuItem>
                                        </Menu>
                                    </Container>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <div>

                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h4" component="h2">
                                    Share "Forest in Amazon"
                                </Typography>
                                <FormControlLabel control={<Switch defaultChecked />} label="Public" />
                                <TextField fullWidth label="Add people by username" id="fullWidth" sx={{ border: 2 }} />
                                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ pt: 2 }}>
                                    People with access:
                                </Typography>
                                <Card id="fullWidth" sx={{ height: 50, bgcolor: '#69C6DE', border: 2, borderColor: '#002956' }}>
                                    <Stack direction="row" spacing={2}>
                                        <Avatar sx={{ bgcolor: 'blue', width: 24, height: 24, mt: 1.5, ml: 1 }}>N</Avatar>
                                        <Typography sx={{ pt: 1.2 }}>@tyler_mcgergor</Typography>
                                    </Stack>
                                </Card>
                                <Card id="fullWidth" sx={{ height: 50, bgcolor: '#69C6DE', border: 2, borderColor: '#002956', mt: 1 }}>
                                    <Stack direction="row" spacing={2}>
                                        <Avatar sx={{ bgcolor: 'red', width: 24, height: 24, mt: 1.5, ml: 1 }}>J</Avatar>
                                        <Typography sx={{ pt: 1.2 }}>@joe_rogan</Typography>
                                    </Stack>
                                </Card>
                            </Box>
                        </Modal>
                    </div>
                </Container>
            </main>
        </ThemeProvider>
    );
}