import React, { useState } from 'react';
import './Login.css'
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import authService from "../../service/auth-service";

async function loginUser(credentials) {
    console.log(credentials);

    try {
        await authService.loadTokens(credentials);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function licenceUser(token) {
    return fetch('https://account.idealapp.fr/api/licences', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    })
        .then((data) => data.text())
        .catch(err => {
            console.debug("Error in fetch", err);
        });
}

function openWebSite() {
    const { shell } = window.require('electron')

    shell.openExternal('https://account.idealapp.fr')
}

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [open, setOpen] = useState();
    const [error, setError] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const authenticated = await loginUser({
            email,
            password
        });
        // if (token) {
        //     setToken(token);
        // } else {

        if (!authenticated) {
            setError("Bad credentials !");
            setOpen(true);
            // return;
        }

        // const licence = await licenceUser(token);
        //
        // console.log(licence);
        //
        // if (licence) {
        //     setLicence(licence);
        // } else {
        //     setError("No license found, please buy a license on our website.");
        //     setOpen(true);
        // }
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

Login.propTypes = {
}