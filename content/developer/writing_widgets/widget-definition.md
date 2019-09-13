---
layout: bt_wiki
title: Widget Definition
description: Description of widget definition including all available configuration parameters.
category: Cloudify Console
draft: false
weight: 300
---

Each `widget.js` file must have a call to the `Stage.defineWidget` global function. 

## Example 

The following code demonstrates how easy it is to create a simple widget. 
You can copy this code and put it in a `widget.js` file to produce a fully working widget. 
See the previous section for the directory structure guidelines.

```javascript
Stage.defineWidget({
    id: 'my-widget',
    name: 'My Widget',
    description: 'This widget displays "Hello World!" text',
    isReact: true,
    categories: [Stage.GenericConfig.CATEGORY.OTHERS],
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,

    render: function(widget, data, error, toolbox) {
        return (
            <span>Hello World!</span>
        );
    }    
});
```


## Widget Settings
 
As seen in the example above, there are some configuration fields that you can provide when you design a widget. 

The `Stage.defineWidget` function receives a settings object with the options described in this table.

Option                 | Type    | Required | Default      | Description
----------             | -----   | -------- | ------------ | -----------
`categories`           | array   | No       | `['Others']` | This property specifies in which categories this widget is shown. It can take an array containing one or more of the values defined in `Stage.GenericConfig.CATEGORY` object: `BLUEPRINTS` ('Blueprints' category), `DEPLOYMENTS` ('Deployments'), `BUTTONS_AND_FILTERS` ('Buttons and Filters'), `CHARTS_AND_STATISTICS` ('Charts and Statistics'), `EXECUTIONS_NODES` ('Executions/Nodes'), `SYSTEM_RESOURCES` ('System Resources'), `OTHERS` ('Others'), `ALL` ('All').
`color`                | string  | No       | `blue`       | The color of the widget. One of the following: `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey` or `black`.
`description`          | string  | No       | -            | Description of the widget that is displayed in the **Add Widget** dialog.
`fetchUrl`             | string/object | No | -            | If `fetchUrl` exists, the data from the URL is fetched by the application and passed to the render and postRender methods. To fetch multiple URLs, you must pass an object where the key is a name you select for this data, and the value is the URL. It is important to note that the render is called once before the data is fetched (to enable information about loading or partial data can be displayed) and once after the data is fetched.
`hasReadme`            | boolean | No       | `false`      | Whether to use `README.md` file. File must be present in widget's main directory. If `helpUrl` is defined and `hasReadme` is set to `true`, then `helpUrl` is used.
`hasStyle`             | boolean | No       | `false`      | Whether to use `style.css` file. File must be present in widget main directory.
`hasTemplate`          | boolean | No       | `false`      | Whether to use `widget.html` file as template. File must be present in widget main directory.
`helpUrl`              | string  | No       | -            | URL to help webpage. If `helpUrl` is defined and `hasReadme` is set to `true`, then `helpUrl` is used.
`id`                   | string  | Yes      | -            | The ID of the widget definition. Must match the name of the directory into which it is placed.
`initialConfiguration` | array   | No       | `[]`         | A list of widget configuration options. The options are displayed when a user clicks the **`Configure`** icon in the top-right corner of the widget in edit mode. 
`initialHeight`        | string  | No       | `12`         | The default height of the widget when added to a page.
`initialWidth`         | string  | No       | `3`          | The default width of the widget when added to a page.
`isReact`              | boolean | No       | `true`       | Set as `true` when writing a React widget.
`name`                 | string  | Yes      | -            | The display name of the widget that is displayed in the **Add Widget** dialog. It is also used as the default widget name.
`showBorder`           | boolean | No       | `true`       | Whether to display border of the widget.
`showHeader`           | boolean | No       | `true`       | Whether to display a header. If a header is not displayed, a user cannot change the widget name.
`permission`           | string  | No       | `CUSTOM_ALL` | This property specifies which user can later access and view this widget. It can take one of the following three values defined in `Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS` object: `CUSTOM_ADMIN_ONLY` (applies for 'sys_admin' and 'manager' roles), `CUSTOM_SYS_ADMIN_ONLY` (applies for 'sys_admin' only, `CUSTOM_ALL` (applies to all user-roles).


#### initialConfiguration

`initialConfiguration` supports 4 generic pre-made configuration fields:

* `Stage.GenericConfig.POLLING_TIME_CONFIG(int)` - How often to refresh the data (in seconds)
* `Stage.GenericConfig.PAGE_SIZE_CONFIG(int)` - The initial number of rows (page size) for widgets presenting data in tabular view. If value not provided, then page size is set to 5
* `Stage.GenericConfig.SORT_COLUMN_CONFIG(string)` - Column name to sort by
* `Stage.GenericConfig.SORT_ASCENDING_CONFIG(boolean)` - Change sorting order (true=ascending)

In addition to listed above, you can create your own configuration fields. Example of configuration with user-defined fields:

```javascript
    initialConfiguration: [
        Stage.GenericConfig.PAGE_SIZE_CONFIG(3),
        {id: 'username', name: 'Fetch with', placeHolder: "GitHub user", description: "...", default: "cloudify-examples", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: 'filter', name: 'Filter', placeHolder:"GitHub filter", description: "...", default: "blueprint in:name NOT local", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "displayStyle", name: "Display style", items: [{name:'Table', value:'table'}, {name:'Catalog', value:'catalog'}], default: "catalog", type: Stage.Basic.GenericField.LIST_TYPE},
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ]
```

Full list of available configuration field types (value of `type` property) you can in the [GenericField component documentation]({{< relref "developer/writing_widgets/widgets-components.html" >}})).

Configuration fields values can be fetched in `render` method using `widget.configuration` object. See [Accessing data in render()]({{< relref "developer/writing_widgets/widget-definition.md#accessing-data-in-render" >}}) for details.


### fetchUrl

There are two primary ways of pulling data from remote sources: `fetchUrl` and `fetchData()`.

`fetchUrl` is an object member and may be defined either as a string or an object with multiple string properties (*property:URL*) where each property represents a separate URL to query.

The following special strings are allowed to be used in URLs:
- `[manager]` - Cloudify Manager base HTTP URL, can be used at the beginning of URL
- `[backend]` - Cloudify UI backend base HTTP URL, can be used at the beginning of URL 
- `[params]` - list of fetch parameters (pairs: name + value) defined within [fetchParams function]({{< relref "developer/writing_widgets/widget-definition.md#fetchParams(widget,-toolbox)" >}}), can be used at the end of URL as query string

#### Single URL

A single URL results are available directly in the *data* object.

```javascript
fetchUrl:  'localhost:50123/public/nodes'
// ...
render: function(widget, data, error, toolbox) {
    let your_data = data;
    //...
}
```

#### Mulitple URL

In case `fetchUrl` is defined with multiple URLs, the results are accessible by the property name of this URL (i.e. *data.nodes*).

```javascript
fetchUrl: {
    nodes: '[manager]/nodes?_include=id,deployment_id,blueprint_id,type,type_hierarchy,number_of_instances,host_id,relationships,created_by[params:blueprint_id,deployment_id,gridParams]',
    deployments: '[manager]/deployments?_include=id,groups[params:blueprint_id,id]'
}
// ...
render: function(widget, data, error, toolbox) {
    let nodes = data.nodes.items;
    let deployments = data.nodeInstances.items; 
    //...
}
```

As seen in the example above, URLs provided in `fetchUrl` can be parametrized with several special tokens:
```javascript
fetchUrl: '[manager]/executions?is_system_workflow=false[params]'
```

* The `[manager]` token is replaced with the current Cloudify Console backend IP address and call is forwarded to Cloudify Manager's REST API.
* The `[backend]` token is replaced with the current Cloudify Console backend IP address.
* The `[params]` token, on the other hand, is quite special. This placeholder can be expanded into a number of things depending on usage:
    * `[params]` alone anywhere in the URL is expanded to default pagination parameters (`_size`, `_offset`, `_sort`) if available (see `initialConfiguration`).
     This mode is **inclusive** - all params available in the widget is appended to URL.
    * `[params:param_name1(,param_name2)]` is replaced with "&paramName1:paramValue1" in the URL.
     Please note that this can be used both to selectively pick pagination parameter as well as custom parameters (see `fetchParams()`).
      This mode is **exclusive** - parameters not specified explicitly are skipped.
      When using selective param picking (`[params:param_name]`) you can use a pre-defined `gridParams` tag to include all pagination parameters (`_size`, `_offset`, `_sort`) instead of specifying explicitly  each of the three.


#### fetchUrl - Inclusive Params 

The following example illustrates *fetchUrl* with both tokens along with their URL:

```javascript
initialConfiguration: [
    Stage.GenericConfig.POLLING_TIME_CONFIG(60),
    Stage.GenericConfig.PAGE_SIZE_CONFIG(),
    Stage.GenericConfig.SORT_COLUMN_CONFIG('column_name'),
    Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
],
fetchUrl: {
    nodes: '[manager]/nodes[params]'
},
fetchParams: function(widget, toolbox) {
    return {
        sampleFuncParam: 'dummy'
    }
}
```

**Result URL:** http://<MANAGER_IP>/sp/?su=/api/v3.1/nodes?&_sort=-column_name&_size=5&_offset=0&sampleFuncParam=dummy

This url can be divided into 3 separate parts:

Field           | Example                                 | Description
---             | ---                                     | ---
manager address | http://<MANAGER_IP>/sp/?su=/api/v3.1/   | The internal value of Cloudify Manager `[manager]`
endpoint name   | nodes?                                  | Remaining part of the REST endpoint address
generic params  | &_sort=-column_name&_size=5&_offset=0   | Parameters that were implicitly added to request. These parameters are inferred from the GenericConfig objects in initialConfiguration and are responsible for pagination of the results. It is possible to omit them by explicitly specifying param names to be used like so `[params:my-param]`. Alternatively, gridParams (sort, size, offset) can be simply removed from `initialConfiguration`.
custom params   | &sampleFuncParam=dummy                  | Custom parameters can be defined in `fetchParams()` function. Each custom parameter must be returned as a property of an Object returned by `fetchParams()` function.

#### fetchUrl - Exclusive Params 

The same URL, this time with explicit param names (and the `gridParams` tag):

```javascript
initialConfiguration: [
    Stage.GenericConfig.POLLING_TIME_CONFIG(60),
    Stage.GenericConfig.PAGE_SIZE_CONFIG(),
    Stage.GenericConfig.SORT_COLUMN_CONFIG('column_name'),
    Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
],
fetchUrl: {
    nodes: '[manager]/nodes[params:sampleFuncParam,gridParams]'
//  which is essentially the same as
//  nodes: '[manager]/nodes[params:sampleFuncParam,_size,_offset_,_sort]'
},
fetchParams: function(widget, toolbox) {
    return {
        sampleFuncParam: 'dummy'
    }
}
```
**Result URL:** http://<MANAGER_IP>/sp/?su=/api/v3.1/nodes?&sampleFuncParam=dummy&_sort=-column_name&_size=5&_offset=0


## Widget Functions

The following functions are available to be defined for custom widgets (they must be provided as properties of object passed to `Stage.defineWidget` function).


### init()

Called when the widget definition is loaded, which occurs after the system is loaded. 
Can be used to define certain elements, for example classes and objects that are used in the widget definition.


### render(widget, data, error, toolbox)

Called each time that the widget needs to draw itself. 
This can occur when the page is loaded, widget data is changed, context data is changed, widget data is fetched, and so on. 

`render` parameters are:

* The [widget object]({{< relref "developer/writing_widgets/widget-apis.md#widget-object" >}}) itself
* The fetched data, either using `fetchUrl` or `fetchData`. The data is `null` if `fetchData` or `fetchUrl` is not specified. 
The data will also pass `null` to the `render` method until data is fetched. If you are expecting data, you can render a "loading" indicator.
* The error if data fetching failed
* The [toolbox object]({{< relref "developer/writing_widgets/widget-apis.md#toolbox-object" >}}).

`render()` is focal to the appearance of the widget as the return value of this function is rendered by ReactJS engine.
As such it is important to understand how to build widgets. 

The following example illustrates the simplest usage:

```javascript
render: function(widget, data, error, toolbox) {
    return (
        <span>Hello World!</span>
    );
}
```

You can learn how to render ReactJS elements and components starting from [here](https://reactjs.org/docs/rendering-elements.html).


#### Using Ready Components In render()

Although using [React DOM Elements](https://reactjs.org/docs/dom-elements.html) (similar to plain HTML tags) gives you extreme flexibility, 
usually it is much quicker to design your widget with the use of Cloudify Console ready-made components.
These components were designed with Console uniformity and ease-of-use in mind, and as are very easy to learn and use.

The following example illustrates how to use a `KeyIndicator` component:

```javascript
render: function(widget, data, error, toolbox) {
    let {KeyIndicator} = Stage.Basic;
    
    return (
        <KeyIndicator title='User Stars' icon='star' number={3} />
    );
}
```

Notice that the `KeyIndicator` component is imported into the widget. It is defined in the render method as: 
```
let {KeyIndicator} = Stage.Basic;
```

You can also import multiple components in the same line, for example: 
```
let {KeyIndicator, Checkmark} = Stage.Basic;
```

Description of other built-in components is available [here]({{< relref "developer/writing_widgets/widgets-components.html" >}}).


#### Accessing Data In render()

There can be several independent data sources for your widget. 
Two most commonly used are the `configuration` and `data` objects.
The following example illustrates how to access both of them:

```javascript
Stage.defineWidget({
    id: 'my-widget',
    name: 'My widget',
    description: 'This widget polls data from two different sources',
    isReact: true,
    initialConfiguration: [
        {id: 'confText', name: 'Conf Item',  placeHolder: 'Configuration text item', default: 'Conf text', type: Stage.Basic.GenericField.STRING_TYPE}
    ],
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,

    fetchData: function(widget, toolbox, params) {
        return Promise.resolve({fetchedText: 'Fetched text'});
    },

    render: function(widget, data, error, toolbox) {
        let {Loading} = Stage.Basic;

        if (_.isEmpty(data)) { // Make sure the data is already fetched, if not show a loading spinner
            return (<Loading message='Loading data...'></Loading>);
        } else {  
            return (
                <div>
                    <p>confItem value: {widget.configuration.confText}</p>
                    <p>fetchedText value: {data.fetchedText}</p>
                </div>
            );
        }
    }
});
```

The above widget will display two lines containing the strings defined in the data sources: "Conf text" and "Fetched Text".
Please note how the widget makes sure data has been loaded has completed before rendering it. 
Skipping this check would result in an error in browser console.

Default value of `initialConfiguration` fields, as the name suggests, is only used if there are no user defined values for these properties.
A user can change them by entering the **Edit Mode** where he can modify widget's configuration. 
From that point, the current widget will use the value provided by the user.
To reset it to it's default value, the widget must be removed and re-added to the page.

Moreover, please remember to remove and re-add the widget to the dashboard if changing the `initialConfiguration` field. 
It is only loaded for newly 'mounted' widgets.


### postRender(container, widget, data, toolbox)

**Non-React widgets only.**

`postRender` is called immediately after the widget has been made visible in the Console. 
This function has access to the same objects as the `render` function with one addition - 
the `container` object containing a reference to the widget's container (parent) object.


### fetchData(widget, toolbox, params)

An alternative to using `fetchUrl` is the `fetchData()` function. It provides greater flexibility when you need to pre-process 
your results or chain them into nested Promises (ie. pull a list of URLs and resolve each of those URLs).
 
`fetchData()` parameters are:

* [widget object]({{< relref "developer/writing_widgets/widget-apis.md#widget-object" >}})
* [toolbox object]({{< relref "developer/writing_widgets/widget-apis.md#toolbox-object" >}})
* params object (see [fetchParams() function]({{< relref "developer/writing_widgets/widget-definition.md#fetchParams(widget,-toolbox)" >}}))

The return value for `fetchData()` is expected to be a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). 
As such if you would like to return a primitive value you would need to wrap it in a promise:

```javascript
fetchData: function(widget, toolbox, params) {
    return Promise.resolve({key:value});
}
```

Please note that should the result be a single primitive value you still need to return it as a property of an Object, 
since referencing the Object directly is illegal in ReactJS. With this in mind, the following example would not work:

```javascript
// THIS WILL NOT WORK
fetchData: function(widget, toolbox, params) { 
    return 10; 
},

render: function(widget, data, error, toolbox){ 
    return (
        <div>
            {data}  // This will produce a runtime error
        </div>
    )
}
```

Instead, you can return the `int` value as a property of the object like so:

```javascript
fetchData: function(widget, toolbox, params) { 
    return {myInt: 10}; 
},
render: function(widget, data, error, toolbox) { 
    return (
        <div>
            {data.myInt}  // OK
        </div>
    )
}
```

**Note**: `fetchUrl` and `fetchData()` are mutually exclusive, 
that is if you define `fetchUrl` in your widget, then `fetchData()` definition is ignored.


### fetchParams(widget, toolbox)

`fetchParams()` function delivers query parameters to 

* `fetchData()` - can be accessed using `params` argument of the function,
* `fetchUrl` - can be accessed using `[params]` wildcard in URL.

Example for `fetchUrl`:

```javascript
fetchUrl: '[manager]/nodes[params]',
fetchParams: function(widget, toolbox) {
    let deploymentId = toolbox.getContext().getValue('deploymentId');

    return {deployment_id: deploymentId};
}
```

Example for `fetchData()`:

```javascript
fetchData: function(widget, toolbox, params) {
    return toolbox.getManager().doGet('/nodes', params);
},
fetchParams: function(widget, toolbox) {
    let deploymentId = toolbox.getContext().getValue('deploymentId');

    return {deployment_id: deploymentId};
}
```