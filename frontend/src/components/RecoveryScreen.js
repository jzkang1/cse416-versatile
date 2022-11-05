import * as React from "react";
import { useContext, useState } from "react";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextModal from './TextModal';

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
            main: "#002956"
        },
        background: {
            default: "#69C6DE"
        }
    }
});

const recoveryStateObj = {
    1: "ENTER_EMAIL",
    2: "SECURITY_QUESTIONS",
    3: "CHANGE_PASSWORD",
    4: "SUCCESS",
}

export default function RecoveryScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    
    const [recoveryState, setRecoveryState] = useState(recoveryStateObj[1]);
    const [securityQuestions, setSecurityQuestions] = useState(null);

    const handleSubmitEmail = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let email = data.get("email");
        if (email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            ) {
                // POSTMARK LOGIC HERE
                let postmark = require("postmark")
                let uniqueCode = Math.floor(100000 + Math.random() * 900000)
                console.log(uniqueCode)
                var client = new postmark.ServerClient("e1e4b14a-6bcf-4224-86a9-bf2c3c3093d0");
                client.sendEmail({
                    "From": "CSE416Versatile@stonybrook.edu",
                    "To": "danielpinyao.huang@stonybrook.edu",
                    "Subject": "Account Recovery One Time Code",
                    "TextBody": uniqueCode
                });
                                
                let securityQuestions = [
                    {question: "what was the name of this app?"},
                    {question: "what class is this project for?"},
                    {question: "what is the name of your professor"},
                ];
        
                if (securityQuestions) {
                    setRecoveryState(recoveryStateObj[2]);
                    setSecurityQuestions(securityQuestions);
                }
        } else {
            auth.showModal("Enter valid email.")
        }
    }

    const handleSubmitSecurityQuestions = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let correct = true;

        if (correct) {
            setRecoveryState(recoveryStateObj[3]);
        }
    }

    const handleSubmitChangePassword = (event) => {
        event.preventDefault();
        
    }

    const getRecoveryContent = () => {
        if (recoveryState === recoveryStateObj[1]) {
            return (
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmitEmail}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete=""
                                name="email"
                                required
                                fullWidth
                                id="email"
                                label="email"
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Continue
                    </Button>
                </Box>
            );
        } else if (recoveryState === recoveryStateObj[2]) {
            let securityQuestionFields = [];
            for (let i = 0; i < securityQuestions.length; i++) {
                let questionID = "q" + i;
                securityQuestionFields.push(
                    <TextField
                        autoComplete=""
                        name={questionID}
                        required
                        fullWidth
                        id={questionID}
                        label={securityQuestions[i].question}
                    />
                );
            }

            return (
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmitSecurityQuestions}
                    sx={{ mt: 3 }}
                >
                    <Stack spacing={2}>
                        {securityQuestionFields}
                    </Stack>
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Continue
                    </Button>
                </Box>
            );
        } else if (recoveryState === recoveryStateObj[3]) {
            return (
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmitChangePassword}
                    sx={{ mt: 3 }}
                >
                    <Stack spacing={2}>
                        <TextField
                            autoComplete=""
                            name=""
                            required
                            fullWidth
                            id=""
                            label={"New password"}
                        />
                        <TextField
                            autoComplete=""
                            name=""
                            required
                            fullWidth
                            id=""
                            label={"Confirm new password"}
                        />
                    </Stack>
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Change password
                    </Button>
                </Box>
            );
        }
    }
    
    return (
        <ThemeProvider theme={theme}>
            <TextModal />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Password Recovery
                    </Typography>
                </Box>

                {getRecoveryContent()}
                
                <Copyright/>
            </Container>
        </ThemeProvider>
    );
}
