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
    FILE: 'file',
    ALIGNMENT: 'alignment',
    SIZE: 'SIZE',
    HIDDEN: 'hidden', // special type (can t be parameter by widgets property)
}

export const TypeToGetValue = {
    'textfield': (value) => {return "\"" + value + "\"";},
    'numfield': (value) => {return value + ".0";},
    'check': (value) => {return (value);},
    'combo': (value) => {return value;},
    'file': (value) => {return value;},
    'hidden' : (value) => {return value;},
}