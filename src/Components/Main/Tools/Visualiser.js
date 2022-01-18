import React from 'react';
import Phones from '../Components/Phones/Phones';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Main from '../Main';

const Visualiser = () => {

    return (<VisibilityIcon onClick={() => Phones.actualPhone().setVisualiser()}/>)
}

export default Visualiser