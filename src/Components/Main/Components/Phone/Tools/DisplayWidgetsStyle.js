import React from "react";

class DisplayWidgetsStyle extends React.Component {

    static DisplayKeys = {Column: 'Column', Row: 'Row', Center: 'Center', Padding: 'Padding', Button: 'Button', Text: 'Text', Textfield: 'Textfield', Image: 'Image'};

    static Display = {
        'Column': (widget) => {
            if (widget.properties === undefined) {
                return {};
            }
            const main = widget.properties.mainAxisAlignment.items.find(p => p.value === widget.properties.mainAxisAlignment.value)
            const cross = widget.properties.crossAxisAlignment.items.find(p => p.value === widget.properties.crossAxisAlignment.value)
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
            const main = widget.properties.mainAxisAlignment.items.find(p => p.value === widget.properties.mainAxisAlignment.value)
            const cross = widget.properties.crossAxisAlignment.items.find(p => p.value === widget.properties.crossAxisAlignment.value)
            return {
                style: {
                    justifyContent: main.style,
                    alignItems: cross.style,
                    width: widget.properties.width.value + "%"
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
                display: widget.name,
                style: {
                    borderRadius: widget.properties.rounded.value ? "20px" : "0",
                    width: widget.properties.width.value,
                    height: widget.properties.height.value
                }
            };
        },
    };


}

export default DisplayWidgetsStyle