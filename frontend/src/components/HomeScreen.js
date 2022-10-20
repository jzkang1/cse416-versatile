import React, { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    function handleCreateNewList() {
        store.createNewList();
    }

    const deleteModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        textAlign: "center"
    };

    function handleCloseDeleteModal(event) {
        event.stopPropagation();
        store.unmarkListForDeletion();
    }

    function handleConfirmDeleteList(event) {
        event.stopPropagation();
        store.deleteMarkedList();
    }

    function handleCancelDeleteList(event) {
        event.stopPropagation();
        store.unmarkListForDeletion();
    }

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }

    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
                disabled={store.isListNameEditActive}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
            <Modal
                    open={store.listMarkedForDeletion !== null}
                    onClose={handleCloseDeleteModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={deleteModalStyle}>

                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Delete the Top 5 {store.listMarkedForDeletion !== null ? store.listMarkedForDeletion.name : ""} List ?
                    </Typography>

                    <Button 
                        id='delete-modal-confirm'
                        onClick={handleConfirmDeleteList}
                        variant="contained">
                        Confirm
                    </Button>

                    <Button 
                        id='delete-modal-cancel'
                        onClick={handleCancelDeleteList}
                        variant="contained">
                        Cancel
                    </Button>

                    </Box>
                </Modal>
        </div>)
}

export default HomeScreen;