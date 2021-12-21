import React from "react";
import Phones from "../../Phones/Phones";

class DisplayWidgetsStyle extends React.Component {

    static DisplayKeys = {
        Column: 'Column',
        Row: 'Row',
        Center: 'Center',
        Stack: 'Stack',
        Padding: 'Padding',
        Button: 'Button',
        Text: 'Text',
        Textfield: 'Textfield',
        Image: 'Image',
        Container: 'Container',
        Positioned: 'Positioned'
    };

    static ChildStyle = [];

    static Display = {
        'Column': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            const props = widget.properties;
            const main = props.mainAxisAlignment.items.find(p => p.value === props.mainAxisAlignment.value);
            const cross = props.crossAxisAlignment.items.find(p => p.value === props.crossAxisAlignment.value);

            const style = DisplayWidgetsStyle.getMyStyle(widget._id);
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

            const style = DisplayWidgetsStyle.getMyStyle(widget._id);
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
            const style = DisplayWidgetsStyle.getMyStyle(widget._id);
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

            const style = DisplayWidgetsStyle.getMyStyle(widget._id);
            let i = 1;
            for (const child in widget.list) {
                DisplayWidgetsStyle.ChildStyle.push({id: widget.list[child]._id, style: {zIndex: i}});
                i++;
            }
            return {
                style: {
                    height: props.height.value,
                    width: props.width.value,
                    alignItems: align.style,
                    position: "relative",
                }
            };
        },
        'Positioned': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }

            const props = widget.properties;
            const style = DisplayWidgetsStyle.getMyStyle(widget._id);
            for (const child in widget.list) {
                DisplayWidgetsStyle.ChildStyle.push({
                    id: widget.list[child]._id, style: {
                        top: props.top.value + "px" ?? "",
                        left: props.left.value + "px" ?? "",
                        bottom: props.bottom.value + "px" ?? "",
                        right: props.right.value + "px" ?? "",
                        position: "absolute",
                    }
                });
            }
            return {
                style: {
                    height: "100%",

                    backgroundColor: "transparent",
                    ...style,
                }
            };
        },
        'Container': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            const props = widget.properties;
            const style = DisplayWidgetsStyle.getMyStyle(widget._id);
            return {
                style: {
                    height: typeof props.height.value === 'string' && props.height.value.slice(-1) === '%' ? props.height.value : props.height.value + "px",
                    width: typeof props.width.value === 'string' && props.width.value && props.width.value.slice(-1) === '%' ? props.width.value : props.width.value + "px",
                    backgroundColor: "#" + widget.properties.color.value,
                    borderRadius: widget.properties.topLeft.value + "px " + widget.properties.topRight.value + "px " + widget.properties.bottomRight.value + "px " + widget.properties.bottomLeft.value + "px",
                    ...style
                }
            };
        },
        'Padding': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            const style = DisplayWidgetsStyle.getMyStyle(widget._id);
            return {
                style: {
                    padding: widget.properties.padding.value + "px"
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
    };

    static getMyStyle(id) {
        for (const index in DisplayWidgetsStyle.ChildStyle) {
            if (DisplayWidgetsStyle.ChildStyle[index].id === id) {
                return DisplayWidgetsStyle.ChildStyle[index].style;
            }
        }
        DisplayWidgetsStyle.ChildStyle = [];
        return {};
    }

}

export default DisplayWidgetsStyle