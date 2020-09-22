---
layout: bt_wiki
title: Widget Backend
description: Description of Widget Backend feature.
category: Cloudify Console
draft: false
weight: 500
---

With widget backend support user can create HTTP endpoints in Console backend. They allow to define specific actions when endpoint is called. There can be used helper services not available in widget frontend.

Example of working widget with backend can be found [here](https://github.com/cloudify-cosmo/Cloudify-UI-Widget-boilerplate/tree/master/widgets/backendWidget).


## Security Aspects

- Endpoint is accessible only from the widget which created that endpoint.
- Access to external libraries is limited to preconfigured set of libraries.
- Set of allowed external libraries can be modified by changing configuration (`allowedModules` parameter, more details: [User Configuration]({{< relref "working_with/console/customization/user-configuration.md" >}})) page.


## Defining Endpoints

To create endpoint per widget you need to create `backend.js` file with at least one endpoint definition. That file must be placed in widget main folder similarly to `widget.js` file. 


### `backend.js` file structure

Example of `backend.js` file is presented below:

```javascript
module.exports = function(r) {

    r.register('manager', 'GET', (req, res, next, helper) => {
        let _ = require('lodash');
        let jsonBody = require('body/json');
        let url = req.query.endpoint;
        let params = _.omit(req.query, 'endpoint');
        let headers = req.headers;

        jsonBody(req, res, function (error, body) {
            helper.Manager.doPost(url, params, body, headers)
                .then((data) => res.send(data))
                .catch(next);
        })
    });
}
```

`backend.js` file should export a function taking one argument (`r` in example). This function's body contains calls to register method (`r.register` in example). Each call registers HTTP endpoint in the backend.

Syntax of `register` method:

```javascript
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

* `call(method, url, params, data, headers={})` - Performs HTTP request to Cloudify Manager
* `doGet(url, params, headers)` - Performs HTTP GET request to Cloudify Manager
* `doPost(url, params, data, headers)` - Performs HTTP POST request to Cloudify Manager
* `doDelete(url, params, data, headers)` - Performs HTTP DELETE request to Cloudify Manager
* `doPut(url, params, data, headers)` - Performs HTTP PUT request to Cloudify Manager
* `doPatch(url, params, data, headers)` - Performs HTTP PATCH request to Cloudify Manager

where:

* `method` - HTTP methods (allowed methods: 'GET', 'POST', 'DELETE', 'PUT', 'PATCH')
* `url` - Manager REST API URL (eg. `blueprints`, see [Cloudify REST API documentation](http://docs.getcloudify.org/api) for details)
* `params` - JSON object with URL parameters (key is parameter name, value is parameter value, eg. `{param1: 'value1', param2: 'value2'}`) (**Optional**) 
* `data` - JSON object with request body (**Optional**)
* `headers` - JSON object with request headers (**Optional**) 


#### Request

Available methods:

* `call(method, url, params, data, parseResponse=true, headers={}, certificate=null)` - Performs HTTP request
* `doGet(url, params, parseResponse, headers, certificate)` - Performs HTTP GET request
* `doPost(url, params, data, parseResponse, headers, certificate)` - Performs HTTP POST request
* `doDelete(url, params, data, parseResponse, headers, certificate)` - Performs HTTP DELETE request
* `doPut(url, params, data, parseResponse, headers, certificate)` - Performs HTTP PUT request
* `doPatch(url, params, data, parseResponse, headers, certificate)` - Performs HTTP PATCH request

where:

* `method` - HTTP methods (allowed methods: 'GET', 'POST', 'DELETE', 'PUT', 'PATCH')
* `url` - HTTP URL (eg. `http://example.com`)
* `params` - JSON object with URL parameters (key - parameter name, value - parameter value, eg. `{param1: 'value1', param2: 'value2'}`) (**Optional**)
* `data` - JSON object with request body (**Optional**)
* `parseResponse` - boolean value informing if response shall be parsed as JSON (**Optional**)
* `headers` - JSON object with request headers (**Optional**)  
* `certificate` - CA's certificate, only for secured connections (**Optional**)  


## Calling Endpoints

Previously defined endpoints can be accessed in widget frontend using `toolbox.getWidgetBackend()` method (see [getWidgetBackend()]({{< relref "developer/writing_widgets/widget-apis.md#getWidgetBackend()" >}}) for details).

Example of calling endpoint *status* with GET method `widget.js`:
```javascript

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

The *status* endpoint for GET method must be defined in `backend.js` file:
```javascript
module.exports = function(r) {
    r.register('status', 'GET', (req, res, next, helper) => {
        res.send('OK');
    });
}
```
