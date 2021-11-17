import React from "react";

class DisplayWidgetsStyle extends React.Component {

    static DisplayKeys = {Column: 'Column', Row: 'Row', Center: 'Center', Stack: 'Stack', Padding: 'Padding', Button: 'Button', Text: 'Text', Textfield: 'Textfield', Image: 'Image', Navbar: 'Navbar'};

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
        'Navbar': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            return {
                display: widget.properties.placeholder.value
            };
        },
    };


}

export default DisplayWidgetsStyle
