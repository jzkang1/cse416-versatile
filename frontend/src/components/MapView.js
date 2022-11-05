import * as React from "react";
import { useContext } from "react";
import AuthContext from "../auth";
import GlobalStoreContext from "../store";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://mui.com/">
                Versatile
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

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

export default function MapView() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    
    const map = {
        "name": "Green Forest",
        "owner": "JoesRogan",
        "height": 320,
        "width": 320,
        "layers": [
            {
                "grid": [
                    [1,2,3,4],
                    [5,6,7,8],
                    [9,10,11,12],
                    [13,14,15,16]
                ]
            }
        ],
        "tilesets": ["https://thumbs.dreamstime.com/b/seamless-texture-ground-small-stones-concept-design-cute-pattern-brown-cartoon-vector-stone-separate-layers-147597634.jpg"],
        "isPublished": false
    }

    const comments = [
        {username: "mckilla_gorilla", text: "I really like this one", date: "10/30/2022"},
        {username: "joerogan123", text: "Disliked lol", date: "10/29/2022"}
    ]

    const handleClickViewProfile = (event) => {
        store.loadProfile(map.owner);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main">
                <CssBaseline />

                <Box
                    backgroundColor={"#DDD2FF"}
                    borderRadius={4}
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            m: 2,
                        }}
                    >
                        <Typography
                            variant="h4"
                            noWrap
                            component="a"
                            sx={{
                                ml: .6,
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            {map.name}

                        </Typography>
                    </Box>
                    
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        <Box
                            sx={{
                                ml: 2,
                                mr: 2,
                            }}
                        >
                            <img src={require('../images/forest.png')} />
                        </Box>
                        
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexGrow: 1,
                                alignItems: "center"
                            }}
                        >
                            <img
                                width="200"
                                height="200"
                                src={require('../images/dog.jpg')}
                                alt="pfp"
                                style={{
                                    "border-radius": "50%"
                                }}
                            />

                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                @{map.owner}
                            </Typography>

                            <Typography
                                variant="h7"
                                noWrap
                                component="a"
                                onClick={handleClickViewProfile}
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    color: "grey",
                                    textDecoration: "none",
                                }}
                            >
                                View profile
                            </Typography>

                            <Box
                                sx={{
                                    flexGrow: 1,
                                }}
                            >

                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 2,
                                    flexGrow: 0,
                                }}
                            >

                            <Button variant="contained" >
                                Export as JSON
                            </Button>

                            <Button variant="contained" >
                                Make a copy
                            </Button>
                            
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            borderTop: 1,
                            mt: 2,
                            p: 2,
                            display: "flex",
                            flexDirection: "row",
                            gap: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexGrow: 1
                            }}
                        >
                            <QuestionAnswerIcon/>
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
                                2 Comments
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexGrow: 0
                            }}
                        >
                            <ThumbUpIcon/>
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
                                25
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexGrow: 0
                            }}
                        >
                            <ThumbDownIcon/>
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
                                7
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box minWidth={800} minHeight={200} backgroundColor={"white"}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            mt: 2,
                        }}
                    >
                        <TextField
                            autoComplete=""
                            name="comment"
                            required
                            
                            id="comment"
                            label="Write your comment"
                            sx={{
                                flexGrow: 1,
                                m: 2,
                                borderRadius: 200
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                m: 2,
                            }}
                        >
                            Post Comment
                        </Button>
                    </Box>

                    <Stack spacing={2}
                        sx={{
                            ml: 2,
                            mr: 2,
                        }}
                    >
                        {comments.map((comment) => {
                            return (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 2,
                                        p: 2,
                                        borderBottom: 1,
                                    }}
                                >
                                    <AccountCircleIcon/>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Typography>
                                            @{comment.username}
                                        </Typography>
                                        <Typography>
                                            {comment.text}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Stack>

                </Box>

                <Copyright sx={{ mt: 8, mb: 4 }} />

            </Container>
        </ThemeProvider>
    );
}
