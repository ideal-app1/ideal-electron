import React from "react";
import * as Icons from '@material-ui/icons/';
import {Button, Card, CardActions, CardContent, CardMedia, Typography} from "@material-ui/core";

class DisplayWidgetsStyle extends React.Component {

    static DisplayKeys = {
        Column: 'Column',
        Row: 'Row',
        Center: 'Center',
        Stack: 'Stack',
        Padding: 'Padding',
        CarouselSlider: 'CarouselSlider',
        Button: 'Button',
        Text: 'Text',
        Textfield: 'Textfield',
        Image: 'Image',
        Checkbox: 'Checkbox',
        Icon: 'Icon',
        Card: 'Card',
    };

    static Display = {
        'Column': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            const props = widget.properties;
            const main = props.mainAxisAlignment.items.find(p => p.value === props.mainAxisAlignment.value);
            const cross = props.crossAxisAlignment.items.find(p => p.value === props.crossAxisAlignment.value);
            return {
                style: {
                    justifyContent: main.style,
                    alignItems: cross.style
                }
            };
        },
        'Row': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            const props = widget.properties;
            const main = props.mainAxisAlignment.items.find(p => p.value === props.mainAxisAlignment.value);
            const cross = props.crossAxisAlignment.items.find(p => p.value === props.crossAxisAlignment.value);
            return {
                style: {
                    justifyContent: main.style,
                    alignItems: cross.style,
                    width: widget.properties.size.value.w + "%"
                }
            };
        },
        'Center': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            return {
                style: {
                    justifyContent: widget.properties.mainAxisAlignment,
                    alignItems: widget.properties.crossAxisAlignment
                }
            };
        },
        'Stack': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            const props = widget.properties;
            const align = props.alignment.items.find(p => p.value === props.alignment.value);
            return {
                style: {
                    height: props.height.value,
                    width: props.width.value,
                    alignItems: align.style
                }
            };
        },
        'Padding': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            return {
                style: {
                    padding: widget.properties.padding.value + "px"
                }
            };
        },
        'CarouselSlider': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            return {
                style: {
                    height: widget.properties.height.value,
                    width: widget.properties.width.value,
                }
            };
        },
        'Button': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            return {
                display: widget.properties.text.value,
                style: {
                    backgroundColor: widget.properties.enable.value === "disabled" ? "lightgray" : widget.properties.color.value,
                    width: widget.properties.width.value,
                    height: widget.properties.height.value
                }
            };
        },
        'Text': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            return {
                display: widget.properties.data.value,
                style: {
                    fontSize: widget.properties.fontSize.value + "px"
                }
            };
        },
        'Textfield': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            return {
                display: widget.properties.placeholder.value
            };
        },
        'Image': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            return {
                style: {
                    borderRadius: widget.properties.rounded.value ? "20px" : "0",
                    width: widget.properties.size.value.w,
                    height: widget.properties.size.value.h,
                    backgroundImage: widget.properties.url.value ? `url(${widget.properties.url.value})` : null,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain'
                }
            };
        },
        'Checkbox': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            return {
                display:
                    <div>
                        <input
                            readOnly={true}
                            id={widget._id}
                            name={widget._id}
                            type={'checkbox'}
                            checked={widget.properties.checked.value}
                        />
                        <label for={widget._id}> {widget.properties.data.value}</label>
                    </div>,
                style: {
                    fontSize: widget.properties.fontSize.value + "px",
                },
            };
        },
        'Icon': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            const icon = widget.properties.icon.items.find(p => p.value === widget.properties.icon.value);
            const color = widget.properties.color.items.find(p => p.value === widget.properties.color.value);

            return {
                display: React.createElement(Icons[icon.web], {
                    className: icon.web,
                    style: {fontSize: widget.properties.size.value, color: color.web}
                })
            }
        },
        'Card': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            const color = widget.properties.buttonColor.items.find(p => p.value === widget.properties.buttonColor.value);

            return {
                display:
                    <Card style={{width: widget.properties.width.value, height: widget.properties.height.value}}>
                        <CardMedia
                            component="img"
                            image={widget.properties.imgUrl.value}
                        />
                        <CardContent>
                            <Typography component="div" style={{fontSize: widget.properties.titleSize.value + "px"}}>
                                {widget.properties.titleContent.value}
                            </Typography>
                            <Typography style={{fontSize: widget.properties.textSize.value + "px"}}>
                                {widget.properties.textContent.value}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button style={{height: widget.properties.buttonHeight.value, width: widget.properties.buttonWidth.value, backgroundColor: color.web}}>
                                {widget.properties.buttonText.value}
                            </Button>
                        </CardActions>
                    </Card>,
                style: {
                }
            };
        },
    };
}

export default DisplayWidgetsStyle