---
layout: bt_wiki
title: REST Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the [utilities plugin]({{< relref "working_with/official_plugins/Configuration/utilities/_index.md" >}}).
{{% /note %}}

## Description
The purpose of this plugin is to provide a generic type in a blueprint in order to integrate with REST based systems. The plugin is suitable for REST API's which expose a relatively high level of abstraction. The general concept is to use JINJA templates that will be evaluated as the content of several independent REST calls. Very often it happens that certian intent requires several REST calls - therefore we can put them in a single template to make blueprint much cleaner to read.

Features:

- JINJA templates
- selective update of runtime properties with REST response content
- configurable recoverable errors
- context sensitive "response expectation"


### Blueprint

**Example Node Template:**

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

### Templates

Templates are a place where we can place multiple REST calls

Template parameters:

- **path** - represents URI of REST call
- **method** - REST emethods (GET/PUT/POST/PATCH/DELETE)
- **headers** - REST headers
- **payload** - YAML representation of data that is to be sent as payload in REST call
- **response_format** - JSON/XML
- **recoverable_codes** - recoverable codes allow to triger operation retry
- **response_translation** - translates response into runtime properties (please see example)
- **response_expectation** - what we expect in a response content. If response is different than specified, system is raising recoverable error and trying until response is equal to specified
- **nonrecoverable_response** - response which is raising non-recoverable error and triggers workflow to stop (give up)
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

blueprint: example-1-blueprint.yaml

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

  * user10-all-properties - in this node we'will put complete response under **user** runtime property 
  * user10-some-properties - in this node we'll selectively put response values under given keys

```shell
(cfy-4.2) $ cfy node-instances list
Listing all instances...

Node-instances:
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+
|               id              | deployment_id | host_id |        node_id         |  state  | availability |  tenant_name   | created_by |
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+
|  user10-all-properties_31b1sn |    example    |         | user10-all-properties  | started |    tenant    | default_tenant |   admin    |
| user10-some-properties_jbckbv |    example    |         | user10-some-properties | started |    tenant    | default_tenant |   admin    |
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+

(cfy-4.2) rest-plugin-examples$ cfy node-instances get user10-all-properties_31b1sn
Retrieving node instance user10-all-properties_31b1sn

Node-instance:
+------------------------------+---------------+---------+-----------------------+---------+--------------+----------------+------------+
|              id              | deployment_id | host_id |        node_id        |  state  | availability |  tenant_name   | created_by |
+------------------------------+---------------+---------+-----------------------+---------+--------------+----------------+------------+
| user10-all-properties_31b1sn |    example    |         | user10-all-properties | started |    tenant    | default_tenant |   admin    |
+------------------------------+---------------+---------+-----------------------+---------+--------------+----------------+------------+

Instance runtime properties:
	user: {'username': 'Moriah.Stanton', 'website': 'ambrose.net', 'name': 'Clementina DuBuque', 'company': {'bs': 'target end-to-end models', 'catchPhrase': 'Centralized empowering task-force', 'name': 'Hoeger LLC'}, 'id': 10, 'phone': '024-648-3804', 'address': {'suite': 'Suite 198', 'street': 'Kattie Turnpike', 'geo': {'lat': '-38.2386', 'lng': '57.2232'}, 'zipcode': '31428-2261', 'city': 'Lebsackbury'}, 'email': 'Rey.Padberg@karina.biz'}

(cfy-4.2) rest-plugin-examples$ cfy node-instances get user10-some-properties_jbckbv
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

(cfy-4.2) rest-plugin-examples$ 

```
