import React from "react";

function CodeLinkWidgetListSearch({widgetList, searchQuery, setSearchQuery, setFilteredWidgets}) {

    const filterWidgets = (widgets, query) => {
        if (!query) {
            return widgets;
        }

        return widgets.filter((widget) => {
            const id = widget._id.toLowerCase();
            return id.includes(query.toLowerCase());
        });
    }

    const search = () => {
        return (
            <div>
                <input
                    id="widgets-search"
                    type="text"
                    placeholder="Search widgets"
                    value={searchQuery}
                    style={{color: '#aaaaaa'}}
                    onChange={e => {
                        e.preventDefault();
                        setSearchQuery(e.target.value);
                        setFilteredWidgets(filterWidgets(widgetList, e.target.value));
                    }}
                />
            </div>
        );
    }

    return search();
}

export default CodeLinkWidgetListSearch;