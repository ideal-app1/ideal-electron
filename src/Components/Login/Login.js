import React, { useState } from 'react';
import './Login.css'
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
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

function openWebSite() {
    const { shell } = window.require('electron')

    shell.openExternal('https://account.idealapp.fr')
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
        <div className={"login-wrapper"}>
            <h1>Login</h1>
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
                    <p>Email</p>
                    <input type="text" onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <button onClick={openWebSite}>Register</button>
        </div>
    )
}
