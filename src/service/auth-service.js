const {remote} = window.require("electron");
const {session} = remote;
const ses = session.fromPartition('persist:auth');
const axios = require("axios");

let accessToken = null;
let licence = null

function getAccessToken() {
    return accessToken;
}

function getLicence() {
    return licence;
}

async function setCookie(data, name, expiration) {
    return await ses.cookies.set({
        url: "http://localhost:3000", //the url of the cookie.
        name: name, // a name to identify it.
        value: data, // the value that you want to save
        expirationDate: expiration.getTime()
    }, function(error) {
        console.log(error);
    });
}

async function getCookie(name) {
    return await ses.cookies.get({
        name: name
    }, function(error) {
        console.log(error);
    });
}

async function removeCookie(name) {
    return await ses.cookies.remove(
        "http://localhost:3000",
        name
    );
}

async function authVerification() {
    const token = await getCookie("token");
    const licence = await getCookie("licence");
    const expiration = new Date();

    // console.log(token, licence);

    if (token.length === 0)
        throw new Error("No available token.");

    if (licence.length === 0)
        throw new Error("No available licence.");

    if (licence[0].expirationDate <= expiration)
        throw new Error("Licence expired.");
}

async function loadTokens(credentials) {
    const expiration = new Date();

    const options = {
        method: "POST",
        url: `https://account.idealapp.fr/api/sanctum/token`,
        headers: {
            "content-type": "application/json",
            'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify(credentials),
    };

    try {
        const response = await axios(options);

        accessToken = response.data;
        expiration.setFullYear(expiration.getFullYear() + 1);
        await setCookie(response.data, "token", expiration)
    } catch (error) {
        await clearInfo();
        throw error;
    }
}

async function loadLicence() {
    const options = {
        method: "GET",
        url: `https://account.idealapp.fr/api/licences`,
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json",
            'Access-Control-Allow-Origin': '*',
        }
    };

    try {
        const response = await axios(options);
        const expiration = new Date();

        if (response.data.length === 0) {
            licence = null;
        } else {
            licence = response.data;
            expiration.setFullYear(licence[0]["expired_at"].split('/')[2]);
            expiration.setMonth(licence[0]["expired_at"].split('/')[1] - 1);
            await setCookie(JSON.stringify(response.data), "licence", expiration);
        }
    } catch (error) {
        await clearInfo();
        throw error;
    }

    if (!getLicence()) {
        await clearInfo();
        throw new Error("No Licence found.");
    }
}

async function clearInfo() {
    await removeCookie("token");
    await removeCookie("licence");

    accessToken = null;
    licence = null;
}


async function logout() {
    await removeCookie("token");
    await removeCookie("licence");

    accessToken = null;
    licence = null;
    window.location.reload();
}

export default {
    getAccessToken,
    getLicence,
    setCookie,
    getCookie,
    removeCookie,
    authVerification,
    loadTokens,
    loadLicence,
    logout,
};