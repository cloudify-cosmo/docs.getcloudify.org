---
layout: bt_wiki
title: Blueprint Structure
category: Intro
draft: false
weight: 400

---

Remember the Python web server application you have [just deployed]({{< relref "intro/getting-started.md" >}})?

Let's see how it's structured.

The blueprint contains a `blueprint.yaml` file which describes our application stack; two scripts which install and uninstall the application and some application related files.

The scripts and application related files are not so interesting right now. What is interesting is the blueprint.yaml file.

This is our `blueprint.yaml` file:

{{< gsHighlight  yaml  >}}
tosca_definitions_version: cloudify_dsl_1_2


imports:
  - http://www.getcloudify.org/spec/cloudify/3.3/types.yaml


inputs:
  webserver_port:
    description: >
      The HTTP web server port.
    default: 8000

  host_ip:
    default: localhost


node_templates:
  host:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_input: host_ip }
      install_agent: false

  http_web_server:
    type: cloudify.nodes.WebServer
    properties:
      port: { get_input: webserver_port }
    relationships:
      - type: cloudify.relationships.contained_in
        target: host
    interfaces:
      cloudify.interfaces.lifecycle:
        create: deploy.py
        delete: uninstall.py


outputs:
  http_endpoint:
    description: Web server external endpoint
    value: { concat: ['http://', { get_property: [ host, ip ] },
                      ':', { get_property: [http_web_server, port] }] }
{{< /gsHighlight >}}


You can see that our blueprint has a `tosca_definitions_version`, and `imports`, `inputs`, `node_templates` and `outputs` sections.

* The `tosca_definitions_version` is the version of the blueprint's DSL (Domain Specific Language).
* `imports` is where you import additional yaml files to use in your blueprint.
* `inputs` are somewhat like the blueprint's configuration. You can set different inputs and use them across the blueprint.
* `node_templates` contains your application's resources and how they're deployed.
* `outputs` are pieces of information you can use after a blueprint was deployed.

There are additional sections which you can use, but we'll ignore them for now.


So what did we do here? Let's break this down

We defined two inputs: the machine's IP (in this case, we're running on our local machine so it's `localhost`.); and the port we'd like the server to be served on.

{{< gsHighlight  yaml  >}}
inputs:
  webserver_port:
    description: >
      The HTTP web server port.
    default: 8000

  host_ip:
    default: localhost
{{< /gsHighlight >}}


We defined node_templates, which contain two resources: a `host` node (our local machine) and an `http_web_server` node. The type of these resources are inherited from the file we imported in the `imports` section. We'll ignore that for now.

Properties are resource level configuration options. Our host contains an `ip` property, which gets its value from one of our inputs using a built-in function called `get_input`.

We're not installing any agents here, so you can ignore `install_agent`.

{{< gsHighlight  yaml  >}}
node_templates:
  host:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_input: host_ip }
      install_agent: false

  ...
{{< /gsHighlight >}}


We defined a `port` property of our `http_web_server` resource, which gets its value from the other input.

We used a `relationship` to state that the `http_web_server` is contained in the `host` and declared the relevant scripts - `install.py` and `uninstall.py` to be executed when installing and uninstalling the application.
The `install.py` and `uninstall.py` files, as well as the Cloudify logo are resources provided alongside the blueprint.

You've seen the instances of these `node_templates` during the [Quickstart]({{< relref "intro/getting-started.md" >}}) when running `cfy local instances`.

{{< gsHighlight  yaml  >}}
node_templates:
  ...

  http_web_server:
    type: cloudify.nodes.WebServer
    properties:
      port: { get_input: webserver_port }
    relationships:
      - type: cloudify.relationships.contained_in
        target: host
    interfaces:
      cloudify.interfaces.lifecycle:
        create: deploy.py
        delete: uninstall.py

{{< /gsHighlight >}}

Lastly, we defined an output, which provides us with the endpoint of our server. You've seen this output during the [Quickstart]({{< relref "intro/getting-started.md" >}}) when running `cfy local outputs`.

{{< gsHighlight  yaml  >}}

outputs:
  http_endpoint:
    description: Web server external endpoint
    value: { concat: ['http://', { get_property: [ host, ip ] },
                      ':', { get_property: [http_web_server, port] }] }
{{< /gsHighlight >}}


# What's Next

If you want to learn more about blueprints, you can head off to the [blueprints]({{< relref "blueprints/overview.md" >}}) section.
