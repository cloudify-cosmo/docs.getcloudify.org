---
layout: bt_wiki
title: SharedResource Node Type
category: Service Composition
draft: false
abstract: Getting to know SharedResource node type
weight: 600
aliases: /service_composition/shared-resource/
---

# Introduction

# SharedResource

## Workflows

## Scaling

## Supporting Relationships


## Node type:

### cloudify.nodes.SharedResource

**Properties:**

* `resource_config`:
    * `deployment`:
        * `id`: This is the deployment ID that the SharedResource's node is connected to.
* `client`: Cloudify HTTP client configuration, if empty the current Cloudify manager client will be used.
    * `host`: Host of Cloudify's manager machine.
    * `port`: Port of REST API service on Cloudify's management machine.
    * `protocol`: Protocol of REST API service on management machine, defaults to http.
    * `api_version`: Version of Cloudify REST API service.
    * `headers`: Headers to be added to HTTP requests.
    * `query_params`: Query parameters to be added to the HTTP request.
    * `cert`: Path on the Cloudify manager to a copy of the other Cloudify manager's certificate.
    * `trust_all`: If False, the server's certificate (self-signed or not) will be verified.
    * `username`: Cloudify user username.
    * `password`: Cloudify user password.
    * `token`: Cloudify user token.
    * `tenant`: Cloudify user accessible tenant name.
 
**Runtime properties:**

These are the used runtime properties for the *internal implementation*:
* `deployment`:
    * `id`: deployment name.

# Examples

* Simple example:
