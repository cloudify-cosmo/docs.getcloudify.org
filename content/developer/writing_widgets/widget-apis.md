---
layout: bt_wiki
title: Widget APIs
description: Description of APIs exposed for widget development.
category: Cloudify Console
draft: false
weight: 400
---

The widget development tools include built-in features, widget objects, functions, templating mechanism and available libraries.

### Widget Object

The `widget` object has the following attributes:

Attribute   | Description
---------   |  -----------
`id`        | The ID of the widget
`name`      | The display name of the widget (the widget definition name is the default name for the widget, but a user can change it in **Edit Mode**)
`height`    | The height of the widget on the page
`width`     | The width of the widget on the page
`x`         | The _x_ location of the widget on the page
`y`         | The _y_ location of the widget on the page
`definition`| The widget definition object as it was passed to `defineWidget` method. All widget definitions are contained in the widget definition object. The only additional field that the widget can access is `template`, which is fetched from the HTML and added to the widget definition.


### Toolbox Object

The `toolbox` object enables widget to communicate with the application and other widgets. 
It also provides generic tools that the widget might require.

The `toolbox` object provides access to the following:

* Utility classes:
  * `Context` - see `getContext()` method
  * `EventBus` - see `getEventBus()` method

* HTTP Requests classes:
  * `External` - see `getExternal(basicAuth)` method
  * `Internal` - see `getInternal()` method
  * `Manager` - see `getManager()` or `getNewManager(ip)` methods
  * `WidgetBackend` - see `getWidgetBackend()` method

Hierarchy of the HTTP Requests classes is presented below: 

![External class hierarchy]( /images/ui/customWidgets/External-class-hierarchy.png )

#### drillDown(widget, defaultTemplate, drilldownContext)

Function used to drill down to a specific page. 


##### Parameters

###### widget

It's [widget object]({{< relref "developer/writing_widgets/widget-apis.md#widget-object" >}}). It is used to define drill down action originator. 
Widget's ID is used during drill down page URL creation.


###### defaultTemplate

When you drill down to a page, you must pass the [drilldownTemplate]({{< relref "developer/writing_widgets/widget-apis.md#drilldown-page-templates" >}}) name. 
When a widget is on a page and you use the drilldown action (for example, in a link click event to a button) 
for the first time to access the page, the app creates a new page based on the passed template. 
When this page is created, the user can edit it like any other page. Each time the user accesses this page, the existing page is shown.

`defaultTemplate` is used during drill down page URL creation.


###### drilldownContext

You can also pass a `drilldownContext` to the drilldown page. This context is saved on the URL and is available through the app context. 
This value is persistent, so if a user drills down to a page and then refreshes the page, the context is saved. 
For example, with the selected deployment in drilldown deployment page.

When selecting a deployment we drill down to a deployment page. It looks like this:

```javascript
    _selectDeployment(item) {
        this.props.toolbox.drillDown(this.props.widget, 'deployment', {deploymentId: item.id});
    }
```

You can see an example of the "deployment" template (used in the example) in the Cloudify Console 
repository in the [/pages/deployment.json](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/templates/pages/deployment.json) file.


##### Drilldown Page Templates

Drilldown page templates are defined in the [/templates/pages](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/templates/pages) directory. 

Each file contains one page template configuration.

Page template configuration has a name which is the default page name, and list of widgets. 
Each widget have the following fields

field         | description
---           | ---
name          | Widget default name
definition    | The ID of the widget to use
width         | The initial width of the widget on the page
height        | The initial height of the widget on the page
x             | The initial x location of the widget on the page
y             | The initial y location of the widget on the page
configuration | The initial configuration of the widget (**Optional**)

If x and/or y are not defined the page is auto arranged (not recommended)

For example:
```json
{
  "name": "template-name",
  "widgets": [
    {
      "name": "Deployments",
      "definition": "deployments",
      "width": 12,
      "height": 24,
      "x": 7,
      "y": 35,
      "configuration": {
        "displayStyle":"list"
      }
    },
    ...
  ]
}
```


#### getContext() 
A widget context gives access to the application context. Using the context we can pass arguments between widgets, 
for example when a blueprint is selected, set the context to the selected blueprint, 
and all the widgets that can filter by blueprint can read this value and filter accordingly.

The context supports these methods:

* `setValue(key, value)` - sets value in context
* `getValue(key)` - returns value from context

#### getEventBus()
 
Used to register (listen to) and trigger events. The event bus is used to enable a widget to broadcast an event, 
usually a change that it made that affect others. For example, if a blueprints widget creates a new deployment, 
other widgets need to be aware that the the deployment list has changed. The listening widgets then call a `refresh`. 
`Event bus` supports the following methods:

* `on (event, callback, context)`
* `trigger (event)`
* `off (event, offCallback)`   
      
For example:
```javascript
componentDidMount() {
    this.props.toolbox.getEventBus().on('deployments:refresh', this._refreshData, this);
}
componentWillUnmount() {
    this.props.toolbox.getEventBus().off('deployments:refresh', this._refreshData);
}
_deleteDeployment() {
    // Do somehting...
    actions.doDelete(deploymentToDelete).then(() => {
        this.props.toolbox.getEventBus().trigger('deployments:refresh');
    }).catch((err) => {
        // Handle errors...
    });
} 
```


#### getExternal(basicAuth) 

Used to access external URLs allowed by Cloudify Console. To access other external URLs, 
you should use [Widget backend]({{< relref "developer/writing_widgets/widget-backend.md" >}}) feature.

If you provide `basicAuth` parameter, then in all HTTP requests 'Authorization' header is set with 'Basic <basicAuth>' value.  
   
Available methods:

```javascript
doGet(url, params, parseResponse, headers)
doPost(url, params, data, parseResponse, headers, withCredentials)
doDelete(url, params, data, parseResponse, headers)
doPut(url, params, data, parseResponse, headers)
doPatch(url, params, data, parseResponse, headers)
doDownload(url, fileName)
doUpload(url, params, files, method, parseResponse=true)
```

Parameters:

* `url` - string, containing URL
* `params` - object, query string parameters passed in object, eg. `{myParam: 'myValue'}`
* `data` - object, request body 
* `parseResponse` - boolean, if set to true, then response is parsed to JSON
* `headers` - object, headers to be passed to request, eq. `{"authentication-token": "jfcSvxDzy8-Fawsie"}` 
* `fileName` - name of the file for the downloaded file

{{% note %}}
We recommend that you use `fetchData()` instead of `doGet(URL, params)` since `fetchData()` not only utilizes `doGet()` but also gives easy access to helper params.
{{% /note %}}


#### getInternal()

Returns `Internal` object (all capabilities of `External` object described above) to make internal HTTP requests on secured connection. 
URLs passed to Internal object methods are prepended with context path: `/console`. 

To all requests the following headers are added:

* **Authentication-Token** header with current token value,
* **tenant** header with current selected tenant name.


#### getManager()

Returns `Manager` object (extends capabilities of `Internal` object described above). 

Used either to make HTTP requests (see `External` object methods above) to Cloudify Manager REST API or to read Manager's properties:

Cloudify Manager REST API HTTP request example:

```javascript
return this.toolbox.getManager().doDelete('/deployments/${blueprint.id}');

doUpload(blueprintName, blueprintFileName, file) {   
    return this.toolbox.getManager().doUpload('/blueprints/${blueprintName}',
                                              _.isEmpty(blueprintFileName) 
                                                ? null   
                                                : {application_file_name: blueprintFileName+'.yaml'},
                                              file);
}
```

Cloudify Manager REST API documentation can be found [here]({{< relref "developer/apis/rest-service.html" >}}).
As you can see in the above example in URL parameter you don't have to provide `/api/vX.X` portion. 

Available methods for getting Cloudify Manager properties:

```javascript
getIp()
getCurrentUsername()
getManagerUrl(url, data)
getApiVersion()
getSelectedTenant()
doGetFull(url, params, parseResponse, fullData, size)
```

#### getNewManager(ip)

Returns `Manager` object connected on the specified IP. 

May be needed in order to join a different manager (eg. for cluster joining).


#### getWidgetBackend()

Returns `WidgetBackend` object (all capabilities of `Internal` object described above). 

It allows you to make HTTP requests on previously defined widget backend endpoints 
(see [Widget backend]({{< relref "developer/writing_widgets/widget-backend.md#" >}}) section for details). 


#### getWidgetDefinitionId

Returns widget ID (see [widget object]({{< relref "developer/writing_widgets/widget-apis.md#widget-object" >}})).


#### goToHomePage

Redirects user to home page.


#### goToPage(pageName)

Redirects user to page with ID (URL alias) passed in `pageName` argument.


#### goToParentPage

Redirects user to parent page (used when you are in drill-down page).


#### loading(boolean)

Shows/hides a loading spinner in widget header. 

**Not allowed in `render()` and `postRender()`** methods as it changes store state leading to `render()` and `postRender()` re-run.


#### refresh()

If we did some actions in the widget that require fetching the data again (for example we added a record) we can ask the app to refresh only this widget by calling refresh().

### Stage global object

There is `Stage` global object available, it can be accessed from widgets code.

#### Stage.Basic object

It contains basic React components. Many [Semantic-UI-React](https://react.semantic-ui.com/) components are exposed using that object. 
Detailed documentation about content can be found in [Widget Components API Reference]({{< relref "developer/writing_widgets/widgets-components.html" >}}).

#### Stage.Common object

It contains constants, functions and React components shared between built-in widgets. This API can change.

To see what is exposed in latest version see source code: [common widget folder](https://github.com/cloudify-cosmo/cloudify-stage/tree/master/widgets/common/src).

#### Stage.Utils object

It contains utility functions shared between built-in widgets and main application. 
They are related to execution, JSON, time and URL handling.

To see what functions are available in latest version see source code: [main file](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/app/utils/stageUtils.js) and [shared folder](https://github.com/cloudify-cosmo/cloudify-stage/tree/master/app/utils/shared).


### Widget Template

The widget template is an html file written with [lodash template engine](https://lodash.com/docs/4.15.0#template).
 
Widget template if fetched when the widget definition is loaded, and its passed to the render function. To access it use widget.definition.template.
To render the template using the built in lodash templates engine use `_.template(widget.definition.template)(data);`, where 'data' is any context you want to pass on to the template.
For example, a simple render function looks like this:

```javascript
render: function(widget,data,toolbox) {
    if (!widget.definition.template) {
        return 'missing template';
    }
    return _.template(widget.definition.template)();
}
```


### External Libraries

The external libraries available to a widget are: `React`, `PropTypes`, `moment`, `jQuery`, `Lodash` and `markdown-js`.

You can assume that the following names are globally available as they are attached to the browser window object:

**React** - [react library](https://github.com/facebook/react)
You can use React API, e.g for creating refs or context.
React library is already loaded, so you don't have to import it.
 
for example:
```javascript
export default class PagesList extends React.Component {
    constructor(props) {
        super(props);

        this.pagesRef = React.createRef();
    }
    // ...
}
```

**PropTypes** - Runtime type checking for React props and similar objects. [prop-types library](https://github.com/facebook/prop-types)

for example:
```javascript
export default class SideBar extends Component {
    static propTypes = {
        homePageId: PropTypes.string.isRequired,
        pageId: PropTypes.string.isRequired,
        isEditMode: PropTypes.bool.isRequired,
        isOpen: PropTypes.bool
    }
    // ...
}
```  

**moment** - Date/Time parsing utility. [Moment documentation](http://momentjs.com/docs/)

for example:
```javascript
var formattedData = Object.assign({},data,{
    items: _.map (data.items,(item)=>{
        return Object.assign({},item,{
            created_at: moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
            updated_at: moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
        })
    })
});
```

**jQuery** - Feature-rich JS library. [jQuery API](http://api.jquery.com/)

for example:
```javascript
function postRender(el,widget,data,toolbox) {
    $(el).find('.ui.dropdown').dropdown({
        onChange: (value, text, $choice) => {
            context.setValue('selectedValue',value);
        }
    });
}
```

**Lodash** - Modern JavaScript utility library delivering modularity, performance & extras. [Lodash documentation](https://lodash.com/docs)

for example:
```javascript
_.each(items, (item)=>{
    //...
});
```

**markdown-js** - JavaScript Markdown parser. [markdown-js documentation](https://github.com/evilstreak/markdown-js)
            
for example:
```javascript
let content = "An h1 header\n" +
              "============\n" +
              "\n" +
              "Paragraphs are separated by a blank line.\n" +
              "\n" +
              "2nd paragraph. *Italic*, **bold**, and `monospace`. Itemized lists\n" +
              "look like:\n" +
              "\n" +
              "  * this one\n" +
              "  * that one\n" +
              "  * the other one\n";
let readmeContent = markdown.parse(content);
```
