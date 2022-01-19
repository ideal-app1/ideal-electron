import React, { Fragment, useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Process from '../Tools/Process';
import Main from '../../../Main';
import { Divider, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Path from '../../../../../utils/Path';
import FormControl from '@material-ui/core/FormControl';
import ListSubheader from '@material-ui/core/ListSubheader';

function Emulators() {

    const [emulators, setEmulators] = React.useState([]);
    const [devices, setDevices] = React.useState([]);
    const [selectedPlatform, setSelectedPlatform] = React.useState(Main.FlutterDevice);

    const listPlatforms = (platform, setState, setDefault) => {
        Process.runScript(Main.FlutterSDK + " " + platform, (stdout) => {
            let platformList = [];
            let res = stdout.split('\n');
            for (let i = 2; i < res.length; i++) {
                if (res[i] === "")
                    break;
                const platformInfo = res[i].split(' • ');
                platformList.push({ name: platformInfo[0], id: platformInfo[1] })
            }
            setState(platformList);

            if (setDefault && platformList.length > 0) {
                setSelectedPlatform(platformList[0].id);
                Main.FlutterDevice = platformList[0].id;
            }
        });
    }

    if (Main.FlutterSDK != "") {
        if (devices.length === 0)
            listPlatforms('devices', setDevices, true);

        if (emulators.length === 0)
            listPlatforms('emulators', setEmulators);
    }

    const openXcode = () => {
        return (
            <div>
                <Divider/>
                <Button onClick={() => {
                    Process.runScript('open ' + Path.build(Main.MainProjectPath, 'ios', 'Runner.xcodeproj'));
                }}>
                    Open iOS Module in Xcode
                </Button>
            </div>
        )
    }

    const refreshPlatforms = () => {
        setEmulators([]);
        setDevices([]);
        setSelectedPlatform('none');
        Main.FlutterDevice = 'none';
        listPlatforms('devices', setDevices, true);
        listPlatforms('emulators', setEmulators);
    }

    return (
        <FormControl>
            <Select
                className={'emulator-list'}
                style={{minWidth: 100}}
                value={selectedPlatform}
                variant={'outlined'}
                MenuProps={{className: 'emulator-list-menu'}}
                onChange={event => {
                    if (!event.target.value || emulators.find(x => x.name === event.target.value))
                        return;
                    setSelectedPlatform(event.target.value);
                    Main.FlutterDevice = event.target.value;
                }}>
                <MenuItem value={'none'} style={{display: 'none'}} disabled>
                    No devices
                </MenuItem>
                <ListSubheader>Devices</ListSubheader>
                {devices.map((x) => {
                    return <MenuItem key={x.id} value={x.id}>{x.name}</MenuItem>
                })}
                <ListSubheader>Launch Emulators</ListSubheader>
                {emulators.map((x) => {
                    return (
                        <Button key={x.name} value={x.name}
                            onClick={() => {
                                Process.runScript(Main.FlutterSDK + ' emulator --launch ' + x.name, () => refreshPlatforms());
                            }}>
                            {x.id}
                        </Button>
                    )
                })}

                { Main.platform !== 'Win32' ? openXcode() : null }
                <Divider/>
                <Button onClick={() => refreshPlatforms()}>
                    Refresh
                </Button>
            </Select>
        </FormControl>
    )
}

export default Emulators