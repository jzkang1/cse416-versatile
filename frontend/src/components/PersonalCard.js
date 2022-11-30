import React from 'react';
import { useContext, useState } from "react";

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import GlobalStoreContext from "../store";
import AuthContext from "../auth";
import ShareIcon from '@mui/icons-material/Share';

export default function PersonalCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const { card } = props;
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenShare = (e, mapId) => {
        console.log("handleOpenShare: " + mapId)
        e.stopPropagation();
        // const mapId = event.currentTarget.parentNode.childNodes[0].innerHTML
        
        store.openShareModal(mapId)
    };

    const handleDuplicateMap = (e, mapId) => {
        console.log("PersonalCard.js: handleDuplicateMap...")

        store.duplicateMap()

        console.log("PersonalCard.js: handleDuplicateMap!")
    }

    const handleDeleteMap = (e, mapId) => {
        console.log("PersonalCard.js: handleDeleteMap...")

        store.deleteMap(mapId)

        console.log("PersonalCard.js: handleDeleteMap!")
    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '155px', display: 'flex', flexDirection: 'column', borderRadius: '8px' }}>

                <Link to={`/editor/${card._id}`}>
                    <CardMedia
                        component="img"
                        src={card.thumbnail}
                        sx={{ height: '130px' }}
                    />
                </Link>
                
                <Container sx={{ pt: .2, height: '25px', backgroundColor: '#F3FFF3', display: 'flex' }}>
                    <Typography variant="body2">
                        {card.name}
                    </Typography>
                    {(card.owner != auth.user.username) ? <ShareIcon fontSize="small" sx={{ml:1}}/> : null }

                    <Button onClick={handleOpenUserMenu}
                        variant="contained" sx={{ marginLeft: 'auto', p: 0, minWidth: '30px', maxHeight: '20px' }}>
                        <MoreVertIcon
                            fontSize='small'
                        />
                    </Button> 
                    
                    <Menu
                        sx={{ mt: "20px" }}
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
                        <MenuItem onClick={(e) => handleOpenShare(e, card._id)}>Share</MenuItem>
                        <MenuItem onClick={(e) => handleDuplicateMap(e, card._id)}>Duplicate</MenuItem>
                        <MenuItem onClick={(e) => handleDeleteMap(e, card._id)}>Delete</MenuItem>
                    </Menu>
                </Container>
            </Card>
        </Grid>
    );
}