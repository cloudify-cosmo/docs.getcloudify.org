---
layout: bt_wiki
title: Features
category: Composer
draft: false
weight: 350
---

This section describes the main functions related to creating a Blueprint. Typically, when you are using {{< param cfy_composer_name >}}, your workflow will follow a similar order to that described in this section. 


## Importing nodes

Before you start to design your blueprint, you will typically want to add the stencils that contain the basic node types that you need to work with, and the operations that they expose. For more information about node types, [click here]({{< relref "developer/blueprints/spec-node-types.md" >}}).

When you add a plugin as an import to {{< param cfy_composer_name >}}, both the nodes types and the operations that the plugin exposes are supported in the blueprint. See [Managing Plugins]({{< relref "developer/composer/managing-plugins.md" >}}) on how to add plugins to a blueprint.


## Working with nodes

You add a node by dragging the required node type from the Stencils pane and dropping it onto the canvas. You then click it to edit its properties. Available properties depend on the node type.

Depending on their type, you can add nodes inside other nodes. For example, a database server can be contained inside a compute node, a subnet node inside a network node, and a port node inside a subnet node. When a node is nested inside another node, a *contained-in* relationship is automatically generated between them. 

You can define other relationships between nodes by clicking, holding and dragging the pointer from the right (exit) arrow of one node to the left (entrance) arrow of another. This action generates a *connected-to* relationship type. 

See [Topology view]({{< relref "developer/composer/blueprint-creation.md#topology-view" >}}) for more details on working with nodes.


## Working with source code

Every addition or change that you make to the topology of your Blueprint package is reflected in code of the main blueprint YAML file. 

See [Source view]({{< relref "developer/composer/blueprint-creation.md#source-view" >}}) for more details on working with source code.


## Handling resources

You can organize your blueprint package structure according to your needs. You can upload files and group them into folders, you can edit files inside {{< param cfy_composer_name >}}.

See [Managing Resources]({{< relref "developer/composer/managing-resources.md" >}}) on how to add/remove files/folders from a blueprint.

 
## Handling inputs, outputs and capabilities

Blueprint specification allows developers to define blueprint [inputs]({{< relref "developer/blueprints/spec-inputs.md" >}}), 
[outputs]({{< relref "developer/blueprints/spec-outputs.md" >}}) and
[capabilities]({{< relref "developer/blueprints/spec-capabilities.md" >}}).

See [Managing Inputs, Outputs and Capabilities]({{< relref "developer/composer/managing-inputs-outputs.md" >}})
on how to add inputs, outputs and capabilities to a blueprint.
