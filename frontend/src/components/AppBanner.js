import React from "react";
import { useContext, useState } from "react";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from 'react-router-dom'

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    if (auth && store) {}

    const pages = ["Home", "Personal", "Community"];
    const settings = ["Log in", "Register"];

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        handleCloseUserMenu();
        auth.logoutUser();
    }

    const handleClickOwnProfile = (event) => {
        handleCloseUserMenu(event);
        store.loadProfile(auth.user.username);
    }

    let menuLinks = <div> 
                        <Link to='/login'><MenuItem onClick={handleCloseUserMenu}>Login</MenuItem></Link>
                        <Link to='/register'><MenuItem onClick={handleCloseUserMenu}>Register</MenuItem></Link>
                    </div>
    if (auth.loggedIn) {
        menuLinks = <div>
                        <MenuItem onClick={handleClickOwnProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </div>
    }

    return (
        <AppBar position="static"
            sx={{
                backgroundColor: "#002956"
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img src={require("../images/logo.png")} width="40" height="40"/>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            ml: .6,
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        ersatile
                    </Typography>
                    
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        <Link to='/'><Button sx={{ my: 2, color: "white", display: "block" }}>Home</Button></Link>
                        <Link to='/personal'><Button sx={{ my: 2, color: "white", display: "block" }}>Personal</Button></Link>
                        <Link to='/community'><Button sx={{ my: 2, color: "white", display: "block" }}>Community</Button></Link>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    sx={{
                                        backgroundColor: 'lightblue'
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
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
                            {menuLinks}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}