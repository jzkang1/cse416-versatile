import React from "react";
import { useContext, useState } from "react";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import Link from "@mui/material/Link";
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
    ENTER_USERNAME: "ENTER_USERNAME",
    ENTER_RECOVERY_CODE: "ENTER_RECOVERY_CODE",
    CHANGE_PASSWORD: "CHANGE_PASSWORD"
}

export default function RecoveryScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    
    const [recoveryState, setRecoveryState] = useState(recoveryStateObj.ENTER_USERNAME);
    const [recoveryUsername, setRecoveryUsername] = useState(null);

    const handleSendRecoveryCode = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let inputUsername = data.get("username");
        auth.sendRecoveryCode({
            username: inputUsername
        }, store).then((isValidUsername) => {
            if (isValidUsername) {
                setRecoveryState(recoveryStateObj.ENTER_RECOVERY_CODE);
                setRecoveryUsername(inputUsername)
            }
        })
    }

    const handleSubmitRecoveryCode = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let recoveryCode = data.get("recoveryCode");
        
        auth.validateRecoveryCode({
            username: recoveryUsername,
            recoveryCode: recoveryCode
        }).then((isValidatedCode) => {
            if (isValidatedCode) {
                setRecoveryState(recoveryStateObj.CHANGE_PASSWORD);
            }
        })
    }

    const handleSubmitChangePassword = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let password = data.get("password");
        let passwordVerify = data.get("passwordVerify");

        auth.changePassword({
            username: recoveryUsername,
            password: password,
            passwordVerify: passwordVerify
        })
    }

    const getRecoveryContent = () => {
        if (recoveryState === recoveryStateObj.ENTER_USERNAME) {
            return (
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSendRecoveryCode}
                    sx={{ mt: 3 }}
                >
                    <Stack spacing={2}>
                        <TextField
                            autoComplete=""
                            name="username"
                            required
                            fullWidth
                            id="username"
                            label="username"
                        />
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
        } else if (recoveryState === recoveryStateObj.ENTER_RECOVERY_CODE) {
            return (
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmitRecoveryCode}
                    sx={{ mt: 3 }}
                >
                    <TextField
                        autoComplete=""
                        name="recoveryCode"
                        required
                        fullWidth
                        id="recoveryCode"
                        label="Enter Recovery Code"
                    />
                    
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
        } else if (recoveryState === recoveryStateObj.CHANGE_PASSWORD) {
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
                            name="password"
                            required
                            fullWidth
                            type="password"
                            id="password"
                            label="New password"
                        />
                        <TextField
                            autoComplete=""
                            name="passwordVerify"
                            required
                            fullWidth
                            type="password"
                            id="passwordVerify"
                            label="Confirm new password"
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
