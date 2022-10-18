import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [draggedTo, setDraggedTo] = useState(false);

    function handleDragStart(event, targetId) {
        event.dataTransfer.setData("item", targetId);
    }

    function handleDragOver(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragEnter(event) {
        event.preventDefault();
        console.log("entering");
    }

    function handleDragLeave(event) {
        event.preventDefault();
        console.log("leaving");
        setDraggedTo(false);
    }

    function handleDrop(event, targetId) {
        event.preventDefault();
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        console.log("handleDrop (sourceId, targetId): ( " + sourceId + ", " + targetId + ")");

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }

    function handleEdit() {
        setEditActive(true);
        store.setIsItemEditActive(true);
    }

    function handleOnKeyDown(event) {
        if (event.key === "Enter") {
            store.addUpdateItemTransaction(props.index, event.target.value);
            setEditActive(false);
            store.setIsItemEditActive(false);
        }
    }

    let { index } = props;

    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }

    if (editActive) {
        return (
            <ListItem
                id={'item-' + (index+1)}
                key={props.key}
                className={itemClass}
                sx={{ display: 'flex', p: 1 }}
                style={{
                    fontSize: '48pt',
                    width: '100%'
                }}
            >
                <TextField
                    sx={{ p: 1, flexGrow: 1}}
                    margin="normal"
                    inputProps={{style: {fontSize: 48}}}
                    InputLabelProps={{style: {fontSize: 24}}}
                    autoFocus
                    defaultValue={props.text}
                    onKeyDown={handleOnKeyDown}
                >
                    {props.text}
                </TextField>
            </ListItem>
        );
    }

    return (
            <ListItem
                id={'item-' + (index+1)}
                key={props.key}
                className={itemClass}
                onDragStart={(event) => {
                    handleDragStart(event, (index+1))
                }}
                onDragOver={(event) => {
                    handleDragOver(event, (index+1))
                }}
                onDragEnter={(event) => {
                    handleDragEnter(event, (index+1))
                }}
                onDragLeave={(event) => {
                    handleDragLeave(event, (index+1))
                }}
                onDrop={(event) => {
                    handleDrop(event, (index+1))
                }}
                draggable="true"
                // sx={{ display: "", p: 1 }}
                style={{
                    fontSize: '48pt',
                    width: '100%'
                }}
            >
            <Box sx={{ p: 1 }}>
                <IconButton
                    aria-label='edit'
                    onClick={handleEdit}
                >
                    <EditIcon style={{fontSize:'48pt'}}/>
                </IconButton>
            </Box>
                <Box sx={{ p: 1, flexGrow: 1 }}>{props.text}</Box>
            </ListItem>
    )
}

export default Top5Item;