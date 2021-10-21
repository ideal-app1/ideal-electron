import React, { useState } from 'react';
import './Login.css'
import Alert from '@material-ui/lab/Alert';
import {Grid, Button, IconButton, Collapse, Container} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import authService from "../../service/auth-service";
import IdealLogo from "../../../assets/icon.png";
import {Email, Lock} from "@material-ui/icons";

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
                    <Grid container item xs={12} className={"login-header-title"} direction={'row'}>
                        <img
                            src={IdealLogo}
                            height={38}
                            width={38}
                            style={{margin: "20px"}}
                            alt={'ideal logo'}/>
                        <h1 className={"login-header-title"}>IDEAL</h1>
                    </Grid>
                    <Grid container item xs={12} className={"login-content"}>
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
                                <Grid container item justifyContent={"left"} direction={"row"}>
                                    <Email style={{fontSize: '1.5rem', marginRight: "1rem", marginTop: "18px"}} />
                                    <h4>Email</h4>
                                </Grid>
                                <input className={"login-input"} type="text" onChange={e => setEmail(e.target.value)} />
                            </label>
                            <label>
                                <Grid container item justifyContent={"left"} direction={"row"}>
                                    <Lock style={{fontSize: '1.5rem', marginRight: "1rem", marginTop: "18px"}} />
                                    <h4>Password</h4>
                                </Grid>
                                <input className={"login-input"} type="password" onChange={e => setPassword(e.target.value)} />
                            </label>
                            <Grid container justifyContent={"center"}>
                                <Button className={"login-button"} variant="contained" color="primary" type="submit">Login</Button>
                            </Grid>
                        </form>
                        <Grid container item justifyContent={"center"}>
                            <Button className={"forgot-password-button"} variant="contained" color="secondary" onClick={openWebSiteForgotPassword}>Forgot Password</Button>
                        </Grid>
                    </Grid>
                    <Grid container className={"register-box"}>
                        <Button className={"register-button"} variant="contained" color="primary" onClick={openWebSiteRegister}>Register</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
