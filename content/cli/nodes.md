---
layout: bt_wiki
title: nodes
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 150
---

The `cfy nodes` command is used to view information on the different nodes of a deployment.

You can use the command to list all nodes and get information on a single node.


## Commands


### list

Usage: `cfy nodes list -d DEPLOYMENT_ID`

Lists all nodes for a deployment.

#### Required flags

* `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment to list nodes for. If omitted, this will list nodes for all deployments


### get

Usage: `cfy nodes get [options] -d DEPLOYMENT_ID --node-id NODE_ID`

Retrieve information on a single execution.

#### Required flags

*  `--node-id=NODE_ID` -    The node's ID
*  `-d, --deployment-id=DEPLOYMENT_ID` - The deployment ID to which the node is related
