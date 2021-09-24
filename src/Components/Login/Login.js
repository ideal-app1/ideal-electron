import React, { useState } from 'react';
import './Login.css'
import Alert from '@material-ui/lab/Alert';
import {Grid, Button, IconButton, Collapse, Container} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import authService from "../../service/auth-service";


async function loginUser(credentials) {
    try {
        await authService.loadTokens(credentials);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function licenceUser() {
    try {
        await authService.loadLicence();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

function openWebSiteRegister() {
    const { shell } = window.require('electron')

    shell.openExternal('https://account.idealapp.fr')
}

function openWebSiteForgotPassword() {
    const { shell } = window.require('electron')

    shell.openExternal('https://account.idealapp.fr/forgot-password')
}


export default function Login({setAuthenticated}) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [open, setOpen] = useState();
    const [error, setError] = useState();

    const handleSubmit = async e => {
        e.preventDefault();

        let authenticated = await loginUser({
            email,
            password
        });

        if (!authenticated) {
            setError("Bad credentials !");
            setOpen(true);
            setAuthenticated(authenticated);
            return;
        }

        authenticated = await licenceUser();
        if (!authenticated) {
            setError("No license found, please buy a license on our website.");
            setOpen(true);
        }
        setAuthenticated(authenticated);
    }

    return(
        <div className={"login-background"}>
            <Container maxWidth="sm" className={"login-wrapper"}>
                <Grid container className={"login-container"}>
                    <Grid item xs={12} className={"login-header"}>
                        <h1 className={"login-header-title"}>IDEAL</h1>
                    </Grid>
                    <Grid item xs={12} className={"login-content"}>
                        <img src={'../assets/icon.png'} alt=''/>
                        <Collapse in={open}>
                            <Alert
                                severity="error"
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            >
                                {error}
                            </Alert>
                        </Collapse>
                        <form onSubmit={handleSubmit} >
                            <label>
                                <h4>Email</h4>
                                <input className={"login-input"} type="text" onChange={e => setEmail(e.target.value)} />
                            </label>
                            <label>
                                <h4>Password</h4>
                                <input className={"login-input"} type="password" onChange={e => setPassword(e.target.value)} />
                            </label>
                            <Grid container className={"login-submit"} justifyContent={"center"}>
                                <Button variant="contained" color="primary" type="submit">Login</Button>
                            </Grid>
                        </form>
                        <Grid container className={"login-redirect"} justifyContent={"center"}>
                            <Grid item>
                                <Button variant="contained" color="secondary" onClick={openWebSiteForgotPassword}>Forgot Password</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container className={"login-header"} justifyContent={"center"}>
                        <h1 className={"login-header-title"}><Button variant="contained" color="primary" onClick={openWebSiteRegister}>Register</Button></h1>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
