const {remote} = window.require("electron");
const {session} = remote;
const ses = session.fromPartition('persist:auth');
const axios = require("axios");

let accessToken = null;
let licence = null
let profile = null;

function getAccessToken() {
    return accessToken;
}

function getLicence() {
    return licence;
}

function getProfile() {
    return profile;
}

async function setCookie(data, name, expiration) {
    let result = await ses.cookies.set({
        url: "http://localhost:3000", //the url of the cookie.
        name: name, // a name to identify it.
        value: data, // the value that you want to save
        expirationDate: expiration.getTime()
    }, function(error) {
        console.log(error);
    });

    console.log(result);

    return result;
}

async function getCookie(name) {
    let result = await ses.cookies.get({name: name}, function(error, cookies) {
        console.log(cookies[0].value); // the value saved on the cookie
        console.log(error);
    });

    console.log(result);

    return result;
}

async function removeCookie(name) {
    let result = await ses.cookies.remove({
        url: "http://localhost:3000", //the url of the cookie.
        name: name, // a name to identify it.
    }, function(error) {
        console.log(error);
    });

    console.log(result);

    return result;
}

function offlineAuthChecking() {
    console.log("offline AUTH");

    return false;
}

async function refreshTokens() {
    const token = await getCookie("token");

    console.log("hello there: ", token);

    if (token.length === 0)
        throw new Error("No available token.");

    return;
    let expiration = new Date();
    let hour = expiration.getHours();

    hour = hour + 6;
    expiration.setHours(hour);

    if (token) {
        const refreshOptions = {
            method: "POST",
            url: `https://account.idealapp.fr/api/sanctum/token`,
            headers: {
                "content-type": "application/json",
                'Access-Control-Allow-Origin': '*',
            },
            data: {
                grant_type: "refresh_token",
                email: "lucas.marcel@epitech.eu",
                password: "ideal-lucas",
                refresh_token: token,
            },
        };

        try {
            const response = await axios(refreshOptions);

            accessToken = response.data.access_token;
        } catch (error) {
            await logout();

            throw error;
        }
    } else {
        throw new Error("No available refresh token.");
    }
}

async function loadTokens(credentials) {
    const options = {
        method: "POST",
        url: `https://account.idealapp.fr/api/sanctum/token`,
        headers: {
            "content-type": "application/json",

        },
        body: JSON.stringify(credentials),
    };

    try {
        const response = await axios(options);

        console.log(response);

        return;
        accessToken = response.data.access_token;

    } catch (error) {
        await logout();

        throw error;
    }
}

async function logout() {
    removeCookie("token");
    removeCookie("licence");

    accessToken = null;
    licence = null
    profile = null;
}

module.exports = {
    getAccessToken,
    getLicence,
    getProfile,
    setCookie,
    getCookie,
    removeCookie,
    refreshTokens,
    offlineAuthChecking,
    loadTokens,
    logout,
};