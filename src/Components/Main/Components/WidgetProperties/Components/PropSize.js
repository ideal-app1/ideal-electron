import { Grid, InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import React, { Fragment } from 'react';

function PropSize(props) {
    const sizeNumfield = (x, y) => {
        return (
            <TextField
                defaultValue={props.prop.value[x]}
                type="number"
                variant="outlined"
                InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                }}
                onChange={entry => {
                        let values = {
                            ...props.prop.value,
                            [x]: parseInt(entry.target.value)
                        }
                        if (values[x] <= 0) {
                            values[x] = 0
                            entry.target.value = '0'
                        }
                        if (props.prop.value.lockRatio) {
                            values[y] -= (props.prop.value[x] - values[x]) | 0
                            console.log(values)
                        }
                    props.updateState(props.prop, values)
                    }
                }
            />
        )
    }
    const lockStyle = { fontSize: '1rem', paddingLeft: 15}
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
                    props.prop.value.lockRatio ?
                        <LockIcon style={lockStyle}
                            onClick={() => {
                                props.updateState(props.prop, {...props.prop.value, lockRatio: false})
                            }}
                        /> :
                        <LockOpenIcon style={lockStyle}
                            onClick={() => {
                                props.updateState(props.prop, {...props.prop.value, lockRatio: true})
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

export default PropSize