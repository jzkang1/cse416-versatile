import React from 'react';
import { useContext, useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import { GlobalStoreContext } from '../store'
import AuthContext from "../auth";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ShareModal(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    
    const { cards } = props;

    let card;
    for (let i = 0; i < cards.length; i++) {
        if (store.shareMapId == cards[i]._id) {
            card = cards[i]
        }
    }

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const newCollaborator = new FormData(e.currentTarget).get("newCollaborator");
        // auth.showModal(newCollaborator)
        store.shareMap(card._id, newCollaborator);
        store.closeShareModal();
    };

    const handleRemoveShare = (e) => {
        // e.preventDefault();
        // e.stopPropagation();
        
        let username = e.target.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML
        // auth.showModal(username)
        store.removeShare(card._id, username);

        store.closeShareModal();
    };

    const handlePublish = (e) => {
        auth.showModal(card._id)
    };

    if (card) {
        return (
            <Modal
                open={Boolean(store.shareMapId)}
                
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            Share {card.name}
                        </Typography>
                        {/* mt: 2, mb: 2, ml:  */}
                        

                        <Box component="form" onSubmit={handleShare} noValidate sx={{ mt: 1 }}>
                            <TextField fullWidth label="Add people by username" name="newCollaborator" id="fullWidth" sx={{ border: 2 }} />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>Add</Button>
                        </Box>

                    
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ pt: 2 }}>
                        People with access:
                    </Typography>

                    {card.collaborators.map((username) => (
                        <Card id="fullWidth" sx={{ height: 50, bgcolor: '#69C6DE', border: 2, borderColor: '#002956', mt: 1  }}>
                            <Stack id="fullWidth" direction="row">
                                
                                <Avatar sx={{ bgcolor: 'blue', width: 24, height: 24, mt: 1.5, ml: 1 }}>{username.charAt(0).toUpperCase()}</Avatar>
                                <Typography sx={{ pt: 1.2, ml: 1.5}}>{username}</Typography>

                                <Button sx={{ mr: 1, mt: .5, marginLeft: "auto" }} onClick={handleRemoveShare} variant="contained">Remove</Button>
                            </Stack>
                        </Card>
                    ))}
                    

                    <Stack direction="row" sx={{ mt: 2 }} justifyContent="center">
                        <Button onClick={store.closeShareModal} variant="contained">Close</Button>
                    </Stack>
                    
                </Box>
            </Modal>
        );
    }
    // store.shareMapId
    
}