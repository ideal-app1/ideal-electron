export const WidgetType = {
    LIBRARY: 'library',
    PHONE: 'phone',
}

export const WidgetGroup = {
    LAYOUT: 'layout',
    MATERIAL: 'material',
    CODELINK: 'codelink'
}

export const PropType = {
    TEXTFIELD: 'textfield',
    NUMFIELD: 'numfield',
    CHECKBOX: 'check',
    COMBOBOX: 'combo',
    COLOR: 'color',//0C9869 // FFFFFF
    FILE: 'file',
    ALIGNMENT: 'alignment',
    SIZE: 'size',
    VAR: 'var',
    HIDDEN: 'hidden', // special type (can t be parameter by widgets property)
}

export const LayoutType = {
    CHILD: 'child',
    CHILDREN: 'children',
}

export const TypeToGetValue = {
    'textfield': (value, variableName) => {
        return "\"" + value + "\"";
    },
    'numfield': (value, variableName) => {
        if (!value) {
            return null;
        }
        const find = value.toString().slice(-1);
        if (find === "%") {
            const number = value.slice(0, -1);
            return "MediaQuery.of(context).size." + variableName.substring(1) + " * " + number / 100;
        }
        return value + ".0";
    },
    'check': (value, variableName) => {
        return (value);
    },
    'combo': (value, variableName) => {
        return value;
    },
    'file': (value, variableName) => {
        return value;
    },
    'hidden': (value, variableName) => {
        return value;
    },
    'color': (value, variableName) => {
        return "0xFF" + value;
    },
}