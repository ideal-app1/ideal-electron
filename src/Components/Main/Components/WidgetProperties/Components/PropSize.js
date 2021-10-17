import { Grid, InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import React, { Fragment } from 'react';

const propSize = (prop, updateState) => {
    const sizeNumfield = (x, y) => {
        return (
            <TextField
                defaultValue={prop.value[x]}
                type="number"
                variant="outlined"
                InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                }}
                onChange={entry => {
                        let values = {
                            ...prop.value,
                            [x]: parseInt(entry.target.value)
                        }
                        if (values[x] <= 0) {
                            values[x] = 0
                            entry.target.value = '0'
                        }
                        if (prop.value.lockRatio) {
                            values[y] -= (prop.value[x] - values[x]) | 0
                            console.log(values)
                        }
                        updateState(prop, values)
                    }
                }
            />
        )
    }
    const lockStyle = { fontSize: '1rem', paddingLeft: 18}
    return (
        <Fragment>
            <Grid
                container
                item
                direction={'column'}
                justify={'space-between'}>
                <Grid container item direction={'row'} alignItems={'center'} justify={'space-evenly'}>
                    W
                    {sizeNumfield('w', 'h')}
                </Grid>
                {
                    prop.value.lockRatio ?
                        <LockIcon style={lockStyle}
                            onClick={() => {
                                updateState(prop, {...prop.value, lockRatio: false})
                            }}
                        /> :
                        <LockOpenIcon style={lockStyle}
                            onClick={() => {
                                updateState(prop, {...prop.value, lockRatio: true})
                            }}
                        />
                }
                <Grid container item direction={'row'} alignItems={'center'} justify={'space-evenly'}>
                    H
                    {sizeNumfield('h', 'w')}
                </Grid>
            </Grid>
        </Fragment>
    )
}

export default propSize