import React from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import GlobalStoreContext from "../store";
import AuthContext from "../auth";
import ShareIcon from "@mui/icons-material/Share";

export default function PersonalCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const { card } = props;
    const [anchorElUser, setAnchorElUser] = useState(null);

    const navigate = useNavigate();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleClickPersonalCard = (e) => {
        console.log("handle click personal card");
        store.startEditMap(card._id);
    };

    const getCardMedia = () => {
        if (card.isPublished || card.currentlyBeingEdited) {
            return (
                <CardMedia
                    component="img"
                    src={card.thumbnail}
                    sx={{ height: "130px" }}
                />
            );
        }

        return (
            <CardMedia
                component="img"
                src={card.thumbnail}
                sx={{ height: "130px", "&:hover": { cursor: "pointer" } }}
                onClick={handleClickPersonalCard}
            />
        );
    };

    const getMenuButtons = () => {
        let buttons = [];

        if (!card.isPublished && auth.user.username === card.owner) {
            buttons.push(
                <MenuItem onClick={(e) => handleOpenShare(e, card._id)}>
                    Share
                </MenuItem>
            );
            buttons.push(
                <MenuItem onClick={(e) => handlePublishMap(e, card._id)}>
                    Publish
                </MenuItem>
            );
        }

        buttons.push(
            <MenuItem onClick={(e) => handleDuplicateMap(e, card._id)}>
                Duplicate
            </MenuItem>
        );

        if (auth.user.username === card.owner) {
            buttons.push(
                <MenuItem onClick={(e) => handleDeleteMap(e, card._id)}>
                    Delete
                </MenuItem>
            );
        }

        return buttons;
    };

    const handleOpenShare = (e, mapId) => {
        console.log("handleOpenShare: " + mapId);
        e.stopPropagation();
        // const mapId = event.currentTarget.parentNode.childNodes[0].innerHTML

        store.openShareModal(mapId);
    };

    const handlePublishMap = async (e, mapId) => {
        await store.publishMap(mapId);
        setAnchorElUser(null);
    };

    const handleDuplicateMap = async (e, mapId) => {
        console.log("PersonalCard.js: handleDuplicateMap...");

        store.duplicateMap(mapId);
        setAnchorElUser(null);

        console.log("PersonalCard.js: handleDuplicateMap!");
    };

    const handleDeleteMap = (e, mapId) => {
        console.log("PersonalCard.js: handleDeleteMap...");

        store.deleteMap(mapId);
        setAnchorElUser(null);
        console.log("PersonalCard.js: handleDeleteMap!");
    };

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
                sx={{
                    height: "155px",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                }}
            >
                {getCardMedia()}

                <Container
                    sx={{
                        pt: 0.2,
                        height: "25px",
                        backgroundColor: "#F3FFF3",
                        display: "flex",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="body2">{card.name}</Typography>
                        <Typography sx={{ fontSize: 10, color: "grey" }}>
                            {card.isPublished ? " (published)" : ""}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "red" }}>
                            {card.currentlyBeingEdited ? " (being edited)" : ""}
                        </Typography>
                    </Box>

                    {card.owner != auth.user.username ? (
                        <ShareIcon fontSize="small" sx={{ ml: 1 }} />
                    ) : null}

                    <Button
                        onClick={handleOpenUserMenu}
                        variant="contained"
                        sx={{
                            marginLeft: "auto",
                            p: 0,
                            minWidth: "30px",
                            maxHeight: "20px",
                        }}
                    >
                        <MoreVertIcon fontSize="small" />
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
                        {getMenuButtons()}
                    </Menu>
                </Container>
            </Card>
        </Grid>
    );
}
