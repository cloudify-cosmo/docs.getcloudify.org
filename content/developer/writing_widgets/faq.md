---
layout: bt_wiki
title: FAQs
description: Frequently Asked Questions on widget development.
category: Cloudify Console
draft: false
weight: 800
---

## How to present info/warning data to the user?

Use `Message` component.


## How to present error messages to the user?

Use `ErrorMessage` component.


## How to show loading/fetching component?

Use `Loading` component or `loading` prop on specific Semantic UI React component.
Use `Icon` component with `spinner` and `loading` prop set.


## Should I use `propTypes` and `defaultProps`?

Always define `propTypes` and `defaultProps` static’s in new components.

When defining `propTypes` try to be as specific as possible (e.g. when object is expected, then try to specify what kind of fields are expected using `shapeOf` method).


#``# How to use sorting/pagination/searching DataTable features with external APIs?

`fetchData` prop in `DataTable` executing `toolbox.refresh` gives you access to parameters in fetchData method in widget definition. 

A simple widget example below shows how to make use of sorting/pagination/searching features in `DataTable` component.

* `DataTable` initial render triggers `fetchGridData` function, which fetches the data
* `DataTable` passes page size, page offset and sorting details (column name and ascending/descending information) to `fetchGridData` function. If any of these values change the `fetchGridData` function is triggered again
* `[params]` token in `fetchUrl` is translated into grid parameters (see `fetchUrl` function section in [Widget Definition]({{< relref "developer/writing_widgets/widget-definition.md" >}}) page)
* fetched data can be accessed in `render` method as `data` argument and presented using `DataTable` component
  
```jsx
Stage.defineWidget({
    id: 'blueprints-list',
    name: 'Blueprints',
    description: 'Shows blueprint list',
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(5),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],
    fetchUrl: '[manager]/blueprints?_include=id,updated_at,created_at,created_by[params]',

    render(widget, data, error, toolbox) {
        const { DataTable, Loading } = Stage.Basic;
        if (_.isEmpty(data)) {
            return <Loading />;
        }
        
        const fetchGridData = fetchParams => toolbox.refresh(fetchParams);
        const { pageSize, sortColumn, sortAscending } = widget.configuration;
        const { metadata, items } = data;

        return (
            <DataTable
                fetchData={fetchGridData}
                totalSize={metadata.pagination.total}
                pageSize={pageSize}
                sortColumn={sortColumn}
                sortAscending={sortAscending}
                searchable
            >
                <DataTable.Column label="Name" name="id" width="40%" />
                <DataTable.Column label="Created" name="created_at" width="20%" />
                <DataTable.Column label="Updated" name="updated_at" width="20%" />
                <DataTable.Column label="Creator" name="created_by" width="20%" />
                {items.map(item => (
                    <DataTable.Row key={item.id}>
                        <DataTable.Data>{item.id}</DataTable.Data>
                        <DataTable.Data>{item.created_at}</DataTable.Data>
                        <DataTable.Data>{item.updated_at}</DataTable.Data>
                        <DataTable.Data>{item.created_by}</DataTable.Data>
                    </DataTable.Row>
                ))}
            </DataTable>
        );
    }
});
```


### What are the best practices for providing input fields?

1. Use `Form.Field` component as a wrapper for all input fields as it provides a generic way of adding help description, required mark, label and error indication.
2. Don’t use placeholders as labels.
3. Always provide labels for input fields.
4. Mark fields as required when they are mandatory.
5. Provide user friendly field description if possible.


### How to reference static file from widget’s code?

Use `Stage.Utils.Url.widgetResourceUrl` method.
