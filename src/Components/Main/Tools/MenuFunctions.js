
import clone from "rfdc/default";
import WidgetProperties from '../Components/WidgetProperties/WidgetProperties';
import Phones from "../Components/Phones/Phones";
import Main from "../Main";

class MenuFunctions {
    
    constructor() {
    }

    cut = (props) => {
        this.copy(props);
        this.remove(props);
    }

    copy = (props) => {
        const copy = clone(props.widget);
        Phones.phoneList[Main.selection].getRef().current.setState({clipboard: {widget: copy}});
    }

    paste = (props) => {
        let clipboard = Phones.phoneList[Main.selection].getData().clipboard;
        if (!clipboard.widget)
            return;
        let id = clipboard.widget._id;
        const copy = Phones.phoneList[Main.selection].findByID(id);
        const dest = Phones.phoneList[Main.selection].findByID(props.widget._id);
        const widget = Phones.phoneList[Main.selection].findWidgetByID(id);
        if (!widget)
            Phones.phoneList[Main.selection].addToWidgetList(clipboard.widget, id);
        if (copy)
            id = Phones.phoneList[Main.selection].addToWidgetList(clipboard.widget);
        if (props.widget.group === 'layout')
            dest.child.list.push({_id: id, list: []})
        else
            Phones.phoneList[Main.selection].moveByID(id, props.widget._id);

        Phones.phoneList[Main.selection].forceUpdateRef();
    }

    remove = (props) => {
        const widgetList = Phones.phoneList[Main.selection].flattenByID(props.widget._id);
        Phones.phoneList[Main.selection].removeWidgetByID(props.widget._id)
        widgetList.forEach(widget => Phones.phoneList[Main.selection].removeWidgetByID(widget));
        Phones.phoneList[Main.selection].removeByID(props.widget._id);
        Phones.phoneList[Main.selection].forceUpdateRef();
        WidgetProperties.getInstance().current.unsetState();
    }
}

export default MenuFunctions