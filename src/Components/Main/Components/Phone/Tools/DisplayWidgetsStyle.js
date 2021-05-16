import React from "react";

class DisplayWidgetsStyle extends React.Component {

    static DisplayKeys = {Column: 'Column', Row: 'Row', Center: 'Center', Button: 'Button', Text: 'Text', Textfield: 'Textfield', Image: 'Image'};

    static Display = {
        'Column': (widget) => {
            return {
                style: {
                    justifyContent: widget.properties.justify.value,
                    alignItems: widget.properties.align.value
                }
            };
        },
        'Row': (widget) => {
            return {
                style: {
                    justifyContent: widget.properties.justify.value,
                    alignItems: widget.properties.align.value,
                    height: widget.properties.height.value + "%"
                }
            };
        },
        'Center': (widget) => {
            return {
            };
        },
        'Button': (widget) => {
            return {
                display: widget.properties.text.value,
                style: {
                    backgroundColor: widget.properties.state.value === "disabled" ? "lightgray" : widget.properties.color.value,
                    width: widget.properties.width.value,
                    height: widget.properties.height.value
                }
            };
        },
        'Text': (widget) => {
            return {
                display: widget.properties.data.value
            };
        },
        'Textfield': (widget) => {
            return {
                display: widget.properties.placeholder.value
            };
        },
        'Image': (widget) => {
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