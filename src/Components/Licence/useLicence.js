import { useState } from 'react';

export default function useLicence() {
    const getLicence = () => {
        const licenceString = sessionStorage.getItem('licence');
        const userLicence = JSON.parse(licenceString);
        return userLicence?.licence
    };

    const [licence, setLicence] = useState(getLicence());

    const saveLicence = userLicence => {
        sessionStorage.setItem('licence', JSON.stringify(userLicence));
        setLicence(userLicence.licence);
    };

    return {
        setLicence: saveLicence,
        licence
    }
}