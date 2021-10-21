import React from "react";
import {Search} from "@material-ui/icons";
import {Grid} from "@material-ui/core";

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
                <Grid container alignItems={'center'} justifyContent={'center'} direction={'row'} style={{marginBottom: "10px"}}>
                    <Search style={{fontSize: '1.5rem'}}/>
                    <input
                        id="widgets-search"
                        type="text"
                        placeholder="Search widgets"
                        value={searchQuery}
                        style={{color: '#aaaaaa', margin: '10px'}}
                        onChange={e => {
                            e.preventDefault();
                            setSearchQuery(e.target.value);
                            setFilteredWidgets(filterWidgets(widgetList, e.target.value));
                        }}
                    />
                </Grid>
            </div>
        );
    }

    return search();
}

export default CodeLinkWidgetListSearch;