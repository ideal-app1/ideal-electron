import React from "react";
import Widget from "../Widget/Widget";

const WidgetDropPreview = (widget, isOverCurrent) => {
    if (isOverCurrent && widget._id) {
        return (<Widget key={widget._id.toString()} {...widget}/>);
    }
}

export default WidgetDropPreview