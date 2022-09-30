---
title: REST Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the **utilities plugin**.
{{% /note %}}

## Description
The purpose of this plugin is to provide a generic type in a blueprint in order to integrate with REST based systems. The plugin is suitable for REST API's which expose a relatively high level of abstraction. The general concept is to use JINJA templates that will be evaluated as the content of several independent REST calls. Very often it happens that certain intent requires several REST calls - therefore we can put them in a single template to make blueprint much cleaner to read.

Features:

- JINJA templates
- selective update of runtime properties with REST response content
- configurable recoverable errors
- context sensitive "response expectation"


### Blueprint

**Example Node Templates:**

```yaml
  user:
    type: cloudify.rest.Requests
    properties:
      hosts:
      - { get_input: rest_endpoint }
      port: 443
      ssl: true
      verify: false
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          inputs:
            template_file: templates/get-user-all-properties-template.yaml
```

An example of `cloudify.rest.BunchRequests` provided [here](https://github.com/cloudify-incubator/cloudify-utilities-plugin/blob/master/cloudify_rest/examples/example-5-blueprint.yaml).


Action inputs in `cloudify.rest.Requests`:

 * `params`: Template parameters. Default is empty dictionary.
 * `params_attributes`: dictionary with list based path to values in
  `runtime_prioperties`.
 * `template_file`: Template path in blueprint directory. Default is ''.
 * `save_path`: Save result to runtime properties key. Default is directly
  save to runtime properties.
 * `prerender`: Prerender template before run calls `jinja render` =>
  `yaml parse`. Default is `yaml parse` => `jinja render`.
 * `remove_calls`: Remove calls list from results. Default: save calls in
  runtime properties.
 * `auth`: The Rest plugin can be configured to use basic auth. The `auth` parameter is a dictionary. It can have keys `user`, `password`, and `hosts`.

Action inputs in `cloudify.rest.BunchRequests` is list of inputs from
`cloudify.rest.Requests`.

Node properties for `cloudify.rest.Requests` and `cloudify.rest.BunchRequests`:

 * `hosts`: list of hosts name or IP addresses of Rest Servers.
 * `host`: host name or IP addresses of Rest Servers if list of hosts is not
  needed single host can be provided by this property. NOTE: the 'hosts'
  property overwrite the 'host' property.
 * `port`: port number. When -1 default ports are used (80 for ssl = false
  and 443 for ssl = true). Default: -1
 * `ssl`: http or https. Default: `false`
 * `verify`: A boolean which controls whether we verify the server's TLS
  certificate. Default: `true`.
  Supported such values:
   * `True`: default value, check certificates.
   * `False`: ignore server certificates.
   * `<file path>`: path to certificate on local system.
   * `<certificate content>`: certificate content.
 * `timeout`: Optional, timeout value for requests.
 * `cert`: Optional, provide https client certificates. Default: `None`.
   Supported such values:
   * `None`: default value, ignore client certificates,
   * `<file path>`: path to certificate on local system,
   * `<certificate content>`: certificate content.
 * `proxies`: proxies dictionary. By default: empty.
 * `params`: Common params for all calls, will be merged with params from
each call/action.

## Use rest calls actionable events
Add such event handler to `/opt/mgmtworker/config/hooks.conf`.
[See the actionable events documentation for more information]({{< relref "/working_with/manager/actionable-events.md" >}}).
```yaml
hooks:
- event_type: workflow_succeeded
  implementation: cloudify-utilities-plugin.cloudify_rest.tasks.execute_as_workflow
  inputs:
    logger_file: /tmp/hooks_log.log
    properties:
      hosts: ["jsonplaceholder.typicode.com"]
      port: 443
      ssl: true
      verify: false
    template_file: /opt/manager/resources/blueprints/default_tenant/examples/templates/get-user-all-properties-template.yaml
  description: A hook for workflow_succeeded
```

Supported parameters:

* `inputs`: passed from {{< param product_name >}} hooks (or first param hooks)
* `logger_file`: duplicate logger output to separate file
* `properties`: connection properties(same as properties in `cloudify.rest.Requests`)
* `template_file`: absolute path to template file
* `params`: Template parameters, additionally provided `__inputs__` from hooks.
  Default is empty dictionary.
* `save_path`: Save result to runtime properties key. Default is directly
  save to runtime properties.
* `prerender`: Prerender template before run calls `jinja render` =>
  `yaml parse`. Default is `yaml parse` => `jinja render`.
* `remove_calls`: Remove calls list from results. Default: dump only final
  responses.

### Templates

Templates are a place where we can place multiple
[REST template](https://github.com/cloudify-incubator/cloudify-utilities-plugins-sdk/blob/master/README.md#rest-yaml-template-format)
calls.

Template parameters:

- **path** - represents URI of REST call
- **method** - REST methods (GET/PUT/POST/PATCH/DELETE)
- **headers** - REST headers
- **payload** - YAML representation of data that is to be sent as payload in REST call
- **response_format** - JSON/XML
- **recoverable_codes** - recoverable codes allow to triger operation retry
- **response_translation** - translates response into runtime properties (please see example).
- **response_expectation** - what we expect in a response content. If response is different than specified, system is raising recoverable error and trying until response is equal to specified
- **nonrecoverable_response** - response which is raising non-recoverable error and triggers workflow to stop (give up).
- **retry_on_connection_error** - try to send request again even in case when REST endpoint is not available (ConnectionError). It may be useful in cases that we need to wait for some REST service to be up.

**Example content of REST template:**

```
rest_calls:
   - path: /users/10
    method: GET
    headers:
      Content-type: application/json
    payload:
    response_format: json
    recoverable_codes: [400]
    response_translation: [user]
    response_expectation:
        - ['id', '10']

  - path: /posts/{{POST_ID}}
    method: PUT
    headers:
      Content-type: application/json
    payload:
      title: '{{ USERNAME }}'
      body: '{{ WEBSITE }}'
      userId: '{{ USER_ID }}'
    response_format: json
    recoverable_codes: [400]
    response_expectation:
      - ['id', '{{POST_ID}}']

```

### Example

blueprint: [example-1-blueprint.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_rest/example-1-blueprint.yaml)

The example is a REST API from test website: https://jsonplaceholder.typicode.com/.

The purpose of blueprint is to demonstrate how **response_translation** work.

For example, suppose that you were to use a simple GET call, such as:

`GET https://jsonplaceholder.typicode.com/users/10**`

This returns the following JSON:

```json
{
    "id": 10,
    "name": "Clementina DuBuque",
    "username": "Moriah.Stanton",
    "email": "Rey.Padberg@karina.biz",
    "address": {
        "street": "Kattie Turnpike",
        "suite": "Suite 198",
        "city": "Lebsackbury",
        "zipcode": "31428-2261",
        "geo": {
            "lat": "-38.2386",
            "lng": "57.2232"
        }
    },
    "phone": "024-648-3804",
    "website": "ambrose.net",
    "company": {
        "name": "Hoeger LLC",
        "catchPhrase": "Centralized empowering task-force",
        "bs": "target end-to-end models"
    }
}
```

In the blueprint there are two nodes:

  * user10-all-properties - in this node we'will put complete response under
    **user** runtime property
  * user10-some-properties - in this node we'll selectively put response values
    under given keys

```shell
$ cfy node-instances list
Listing all instances...

Node-instances:
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+
|               id              | deployment_id | host_id |        node_id         |  state  | availability |  tenant_name   | created_by |
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+
|  user10-all-properties_31b1sn |    example    |         | user10-all-properties  | started |    tenant    | default_tenant |   admin    |
| user10-some-properties_jbckbv |    example    |         | user10-some-properties | started |    tenant    | default_tenant |   admin    |
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+

rest-plugin-examples$ cfy node-instances get user10-all-properties_31b1sn
Retrieving node instance user10-all-properties_31b1sn

Node-instance:
+------------------------------+---------------+---------+-----------------------+---------+--------------+----------------+------------+
|              id              | deployment_id | host_id |        node_id        |  state  | availability |  tenant_name   | created_by |
+------------------------------+---------------+---------+-----------------------+---------+--------------+----------------+------------+
| user10-all-properties_31b1sn |    example    |         | user10-all-properties | started |    tenant    | default_tenant |   admin    |
+------------------------------+---------------+---------+-----------------------+---------+--------------+----------------+------------+

Instance runtime properties:
    user: {'username': 'Moriah.Stanton', 'website': 'ambrose.net', 'name': 'Clementina DuBuque', 'company': {'bs': 'target end-to-end models', 'catchPhrase': 'Centralized empowering task-force', 'name': 'Hoeger LLC'}, 'id': 10, 'phone': '024-648-3804', 'address': {'suite': 'Suite 198', 'street': 'Kattie Turnpike', 'geo': {'lat': '-38.2386', 'lng': '57.2232'}, 'zipcode': '31428-2261', 'city': 'Lebsackbury'}, 'email': 'Rey.Padberg@karina.biz'}

rest-plugin-examples$ cfy node-instances get user10-some-properties_jbckbv
Retrieving node instance user10-some-properties_jbckbv

Node-instance:
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+
|               id              | deployment_id | host_id |        node_id         |  state  | availability |  tenant_name   | created_by |
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+
| user10-some-properties_jbckbv |    example    |         | user10-some-properties | started |    tenant    | default_tenant |   admin    |
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+

Instance runtime properties:
    user-city-zip: 31428-2261
    user-email: Rey.Padberg@karina.biz
    user-city-geo: {'latitude': '-38.2386', 'longnitude': '57.2232'}
    user-full-name: Clementina DuBuque
    user-city: Lebsackbury

rest-plugin-examples$

```

### Example 2

blueprint: [example-2-blueprint.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_rest/example-2-blueprint.yaml)

Same as above we're using test REST API but this time we'll demonstrate how we
can combine multiple REST calls in a single template. Overall idea is that
we'll first query REST API to provide user details and later on we'll use this
details in order to create user post with POST method.


### Example 3

blueprint: [example-3-blueprint.yaml](ehttps://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_rest/example-3-blueprint.yaml)

Real life example how F5 BigIP can be provisioned with REST API.

### Example 4

blueprint: [example-5-blueprint.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_rest/example-5-blueprint.yaml)

Example for get users list, create new user based on first result and than
remove new created user. use `cloudify.rest.BunchRequests` with
`params_attributes`.

For more examples, see [rest examples](https://github.com/cloudify-community/blueprint-examples/tree/master/utilities-examples/cloudify_rest).
