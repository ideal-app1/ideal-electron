import Phone from '../Components/Phone/Phone';
import clone from "rfdc/default";
import WidgetProperties from '../Components/WidgetProperties/WidgetProperties';

class MenuFunctions {
    
    constructor() {
        this.phone = Phone.getInstance();
    }

    cut = (props) => {
        this.copy(props);
        this.remove(props);
    }

    copy = (props) => {
        const copy = clone(props.widget);
        this.phone.current.setState({clipboard: {widget: copy}});
    }

    paste = (props) => {
        let clipboard = this.phone.current.state.clipboard;
        let id = clipboard.widget._id;
        const copy = this.phone.current.findByID(id);
        const dest = this.phone.current.findByID(props.widget._id);
        const widget = this.phone.current.findWidgetByID(id);
        if (!widget)
            this.phone.current.addToWidgetList(clipboard.widget, id);
        if (copy)
            id = this.phone.current.addToWidgetList(clipboard.widget);
        if (props.widget.group === 'layout')
            dest.child.list.push({_id: id, list: []})
        else
            this.phone.current.moveByID(id, props.widget._id);

        this.phone.current.forceUpdate();
    }

    remove = (props) => {
        const widgetList = this.phone.current.flattenByID(props.widget._id);
        this.phone.current.removeWidgetByID(props.widget._id)
        widgetList.forEach(widget => this.phone.current.removeWidgetByID(widget));
        this.phone.current.removeByID(props.widget._id);
        this.phone.current.forceUpdate();
        WidgetProperties.getInstance().current.unsetState();
    }
}

export default MenuFunctions