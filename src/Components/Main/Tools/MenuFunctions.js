import clone from 'rfdc/default';
import WidgetProperties from '../Components/WidgetProperties/WidgetProperties';
import Phones from '../Components/Phones/Phones';

class MenuFunctions {
    
    constructor() {
    }

    cut = (props) => {
        this.copy(props);
        this.remove(props);
    }

    copy = (props) => {
        Phones.actualPhone().getData().clipboard.widget = clone(props.widget);
    }

    paste = (props) => {
        let clipboard = Phones.actualPhone().getData().clipboard;
        if (!clipboard.widget)
            return;
        let id = clipboard.widget._id;
        const copy = Phones.actualPhone().findByID(id);
        const dest = Phones.actualPhone().findByID(props.widget._id);
        const widget = Phones.actualPhone().findWidgetByID(id);
        if (!widget)
            Phones.actualPhone().addToWidgetList(clipboard.widget, id);
        if (copy)
            id = Phones.actualPhone().addToWidgetList(clipboard.widget);
        if (props.widget.group === 'layout')
            dest.child.list.push({_id: id, list: []})
        else
            Phones.actualPhone().moveByID(id, props.widget._id);
        Phones.actualPhone().forceUpdateRef();
    }

    remove = (props) => {
        const widgetList = Phones.actualPhone().flattenByID(props.widget._id);
        Phones.actualPhone().removeWidgetByID(props.widget._id)
        widgetList.forEach(widget => Phones.actualPhone().removeWidgetByID(widget));
        Phones.actualPhone().removeByID(props.widget._id);
        Phones.actualPhone().forceUpdateRef();
        WidgetProperties.getInstance().current.unsetState();
    }
}

export default MenuFunctions