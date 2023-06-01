---
title: Widget Backend
description: Description of Widget Backend feature.
category: Console
draft: false
weight: 500
---

With widget backend support user can create HTTP endpoints in Console backend. They allow to define specific actions when endpoint is called. There can be used helper services not available in widget frontend.

Examples of widgets with backend support:

* [simple test widget ZIP package](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/test/cypress/fixtures/widgets/testWidgetBackend.zip)
* [Executions widget source code](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/widgets/executions)


## Security Aspects

- Endpoint is accessible only from the widget which created that endpoint.
- Access to external libraries is limited to preconfigured set of libraries.
- Set of allowed external libraries can be modified by changing configuration (`allowedModules` parameter, more details: [User Configuration]({{< relref "working_with/console/customization/user-configuration.md" >}})) page.


## Defining Endpoints

To create endpoint per widget you need to create `backend.ts` (or `backend.js`) file with at least one endpoint definition.
That file must be placed in widget main folder similarly to `widget.js` file.


### `backend.ts` file structure

Example of `backend.ts` file is presented below:

```typescript
export default function(r) {

    r.register('manager', 'GET', (req, res, next, helper) => {
        let _ = require('lodash');
        let jsonBody = require('body/json');
        let url = req.query.endpoint;
        let params = _.omit(req.query, 'endpoint');
        let headers = req.headers;

        jsonBody(req, res, function (error, body) {
            helper.Manager.doPost(url, { params, body, headers })
                .then((data) => res.send(data))
                .catch(next);
        })
    });
}
```

`backend.ts` file should export a function taking one argument (`r` in example). This function's body contains calls to register method (`r.register` in example). Each call registers HTTP endpoint in the backend.
`backend.js` file should use equivalent CommonJS syntax for exporting the function (`module.exports` assignment).  

Syntax of `register` method:

```typescript
function register(name, method, body)
```
where

* `name` - String with HTTP endpoint name on which service is registered,
* `method` - String with HTTP endpoint method on which service is registered,
* `body` - Function (`function(req, res, next, helper)`) to be called on request to this endpoint, where:
    * `req, res, next` - Part of middleware function (see [Using middleware @ ExpressJS](http://expressjs.com/en/guide/using-middleware.html) for details)
    * `helper` - JSON object containing [Helper services]({{< relref "developer/writing_widgets/widget-apis.md#helper-services" >}}).


### Helper Services

In this section helper services, which can be used from `helper` object in endpoints body are described.

#### Logger

This service has no methods. You can just call
```
const logger = helper.Logger('my_endpoint');
```
to get [WinstonJS](https://github.com/winstonjs/winston) logger object using provided string (`my_endpoint`) as logger category.
Check out [WinstonJS](https://github.com/winstonjs/winston) site to learn about this logger.

#### Manager

Available methods:

* `call(method, url, { params, body, headers={} })` - Performs HTTP request to the {{< param cfy_manager_name >}}
* `doGet(url, { params, headers })` - Performs HTTP GET request to the {{< param cfy_manager_name >}}
* `doPost(url, { params, body, headers })` - Performs HTTP POST request to the {{< param cfy_manager_name >}}
* `doDelete(url, { params, body, headers })` - Performs HTTP DELETE request to the {{< param cfy_manager_name >}}
* `doPut(url, { params, body, headers })` - Performs HTTP PUT request to the {{< param cfy_manager_name >}}
* `doPatch(url, { params, body, headers })` - Performs HTTP PATCH request to the {{< param cfy_manager_name >}}

where:

* `method` - HTTP methods (allowed methods: 'GET', 'POST', 'DELETE', 'PUT', 'PATCH')
* `url` - Manager REST API URL (eg. `blueprints`, see [{{< param product_name >}} REST API documentation](http://docs.getcloudify.org/api) for details)
* `params` - JSON object with URL parameters (key is parameter name, value is parameter value, eg. `{param1: 'value1', param2: 'value2'}`) (**Optional**)
* `body` - JSON object with request body (**Optional**)
* `headers` - JSON object with request headers (**Optional**)


#### Request

Available methods:

* `call(method, url, { params, body, parseResponse=true, headers={}, certificate=null })` - Performs HTTP request
* `doGet(url, { params, parseResponse, headers, certificate })` - Performs HTTP GET request
* `doPost(url, { params, body, parseResponse, headers, certificate })` - Performs HTTP POST request
* `doDelete(url, { params, body, parseResponse, headers, certificate })` - Performs HTTP DELETE request
* `doPut(url, { params, body, parseResponse, headers, certificate })` - Performs HTTP PUT request
* `doPatch(url, { params, body, parseResponse, headers, certificate })` - Performs HTTP PATCH request

where:

* `method` - HTTP methods (allowed methods: 'GET', 'POST', 'DELETE', 'PUT', 'PATCH')
* `url` - HTTP URL (eg. `http://example.com`)
* `params` - JSON object with URL parameters (key - parameter name, value - parameter value, eg. `{param1: 'value1', param2: 'value2'}`) (**Optional**)
* `body` - JSON object with request body (**Optional**)
* `parseResponse` - boolean value informing if response shall be parsed as JSON (**Optional**)
* `headers` - JSON object with request headers (**Optional**)  
* `certificate` - CA's certificate, only for secured connections (**Optional**)  


## Calling Endpoints

Previously defined endpoints can be accessed in widget frontend using `toolbox.getWidgetBackend()` method (see [getWidgetBackend()]({{< relref "developer/writing_widgets/widget-apis.md#getWidgetBackend()" >}}) for details).

Example of calling endpoint *status* with GET method `widget.js`:

```jsx
Stage.defineWidget({
    // ... all stuff necessary to define widget ...

    fetchData: function(widget, toolbox, params) {
        return toolbox.getWidgetBackend().doGet('status')
            .then((data) => Promise.resolve({status: data}))
            .catch((error) => Promise.reject('Error fetching status. Error: ' + error));
    },

    render: function(widget,data,error,toolbox) {
        let status = data ? data.status : 'unknown';
        return (
            <p>
                Status: <b>{status}</b>
            </p>
        );
    }
});
```

The *status* endpoint for GET method must be defined in `backend.ts` (or `backend.js`) file:

```typescript
export default function(r) {
    r.register('status', 'GET', (req, res, next, helper) => {
        res.send('OK');
    });
}
```
