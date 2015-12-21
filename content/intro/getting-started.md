---
layout: bt_wiki
title: Quickstart
category: Intro
draft: false
weight: 300

---
{{% gsSummary %}}{{% /gsSummary %}}


After [installing Cloudify]({{< relref "intro/installation.md" >}}), you can now deploy your first application.

Cloudify Applications are defined in what we call `blueprints`, which are a logical representation of an application.
Blueprints can contain everything your application requires - from infrastructure elements, through configuration scripts to application elements, the way resources relate to one another, and much, much more.

Let's deploy a blueprint which sets up a Python web server locally.


## Installing the example application

We've already prepared the application for you and you can download it [here](https://github.com/cloudify-examples/simple-python-webserver-blueprint/archive/master.zip).

Once downloaded, extract the file to a directory and cd into it.

Now let's prepare the environment for our application:

{{< gsHighlight  bash >}}
$ cfy local init --blueprint-path blueprint.yaml --inputs '{"webserver_port": "8000", "host_ip":"localhost"}'
...

Initiated blueprint.yaml
If you make changes to the blueprint, run 'cfy local init -p blueprint.yaml' again to apply them

...
{{< /gsHighlight >}}

You've now initialized the blueprint, provided it with some configuration and it is ready to be deployed.

Cloudify provisions and manages applications using workflows. Workflows are predefined or user defined flows that perform certain actions on your application.

The default workflow used by Cloudify to deploy an application is called the `install` workflow.

To deploy the application, run:

{{< gsHighlight  bash >}}
$ cfy local execute --workflow install
...

2015-11-21 10:56:02 CFY <local> Starting 'install' workflow execution
2015-11-21 10:56:02 CFY <local> [host_cd5ef] Creating node
2015-11-21 10:56:02 CFY <local> [host_cd5ef] Configuring node
2015-11-21 10:56:02 CFY <local> [host_cd5ef] Starting node
2015-11-21 10:56:03 CFY <local> [http_web_server_9eaa3] Creating node
2015-11-21 10:56:03 CFY <local> [http_web_server_9eaa3.create] Sending task 'script_runner.tasks.run'
2015-11-21 10:56:03 CFY <local> [http_web_server_9eaa3.create] Task started 'script_runner.tasks.run'
2015-11-21 10:56:03 LOG <local> [http_web_server_9eaa3.create] INFO: Running WebServer locally on port: 8000
2015-11-21 10:56:03 LOG <local> [http_web_server_9eaa3.create] INFO: Setting `pid` runtime property: 27924
2015-11-21 10:56:03 CFY <local> [http_web_server_9eaa3.create] Task succeeded 'script_runner.tasks.run'
2015-11-21 10:56:04 CFY <local> [http_web_server_9eaa3] Configuring node
2015-11-21 10:56:04 CFY <local> [http_web_server_9eaa3] Starting node
2015-11-21 10:56:05 CFY <local> 'install' workflow execution succeeded

...
{{< /gsHighlight >}}

If everything goes well, the `install` workflow will succeed and you'll be able to `curl http://localhost:8000` to see that your application is up. If you're running Windows, just go to `http://localhost:8000` in your browser to see your beautiful masterpiece.

Cloudify is extensible and supports a variaty of plugins. For instance, you might not have noticed, but when we installed our application, Cloudify used our home-grown script-plugin to execute a bunch of scripts and deploy the web server.

If we wanted to deploy our application on a server in a Cloud Provider of our choice - let's say, AWS, we could've used the AWS and Fabric (SSH) plugins to do it.

Anyway, if a blueprint uses different plugins, they can be installed like so:

{{< gsHighlight  bash >}}
$ cfy local install-plugins -p BLUEPRINT_PATH
{{< /gsHighlight >}}

In this instance, we're only using the script plugin, which we already installed when we installed Cloudify, so.. this will pretty much do nothing.


## Retrieving some information about your deployed application

Cloudify keeps the entire structure of your application in a `model`.

Before a blueprint is ready to be deployed, a `deployment` is created. A deployment is an instance of a blueprint. The `deployment` is also a part of the model. The deployment model contains every piece of information your application contains - for instance, information set during runtime like IP addresses to predefined configuration properties like application ports.

Let's printout some information about the deployment:

{{< gsHighlight  bash >}}
$ cfy local outputs
...

{
  "http_endpoint": "http://localhost:8000"
}

...
{{< /gsHighlight >}}

This will show the outputs from the blueprint's deployment. So, in this instance, you can see that an output of the deployment is the endpoint of your server.


Each logical entity in your application defined within a blueprint is a called a `node`. After a deployment is created, each logical node becomes a set of one or more `node-instances`, which are - you guessed it, instances of that node. A node can have multiple node-instances - for instance, multiple virtual machines.

In this example, we have two nodes, each with one instance. Let's list the instances:

{{< gsHighlight  bash >}}
$ cfy local instances
...

[
  {
    "host_id": "host_cd5ef",
    "id": "http_web_server_9eaa3",
    "name": "http_web_server",
    "node_id": "http_web_server",
    "relationships": [
      {
        "target_id": "host_cd5ef",
        "target_name": "host",
        "type": "cloudify.relationships.contained_in"
      }
    ],
    "runtime_properties": {
      "pid": 27924
    },
    "state": "started",
    "version": 8
  },
  {
    "host_id": "host_cd5ef",
    "id": "host_cd5ef",
    "name": "host",
    "node_id": "host",
    "relationships": [],
    "runtime_properties": {},
    "state": "started",
    "version": 7
  }
]

...
{{< /gsHighlight >}}

We can see all available information on our two instances like their names and their `relationships` to other nodes.


## Uninstalling the application

An `uninstall` workflow is also built-in to Cloudify, which allows you to uninstall a deployed blueprint.

Let's uninstall our application.

{{< gsHighlight  bash >}}
$ cfy local execute -w uninstall
...

2015-11-21 11:07:51 CFY <local> Starting 'uninstall' workflow execution
2015-11-21 11:07:51 CFY <local> [http_web_server_9eaa3] Stopping node
2015-11-21 11:07:51 CFY <local> [http_web_server_9eaa3] Deleting node
2015-11-21 11:07:51 CFY <local> [http_web_server_9eaa3.delete] Sending task 'script_runner.tasks.run'
2015-11-21 11:07:51 CFY <local> [http_web_server_9eaa3.delete] Task started 'script_runner.tasks.run'
2015-11-21 11:07:51 LOG <local> [http_web_server_9eaa3.delete] INFO: Running process PID: 30367
2015-11-21 11:07:51 LOG <local> [http_web_server_9eaa3.delete] INFO: Python Webserver Terminated!
2015-11-21 11:07:51 CFY <local> [http_web_server_9eaa3.delete] Task succeeded 'script_runner.tasks.run'
2015-11-21 11:07:52 CFY <local> [host_cd5ef] Stopping node
2015-11-21 11:07:52 CFY <local> [host_cd5ef] Deleting node
2015-11-21 11:07:53 CFY <local> 'uninstall' workflow execution succeeded

...
{{< /gsHighlight >}}

We've now uninstalled our application. The model was erased and the Web Server is gone. Aww...

That's it! You've just deployed your first application using Cloudify.

You can now learn about the [blueprint]({{< relref "intro/blueprints.md" >}}) you just deployed.
