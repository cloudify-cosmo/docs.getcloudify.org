---
layout: bt_wiki
title: node-instances
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 140
---

The `cfy node-instances` command is used to view information on the different node-instances of a deployment.

You can use the command to list the node-instances of a specific deployment or of all deployments and to retrieve information on a single node-instance.


## Commands

### list

Usage: `cfy node-instances list`

List node-instances.

#### Optional flags

*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        The ID of the deployment to list node-instances for.
                        If omitted, this will list node-instances for all
                        deployments


### get

Usage: `cfy node-instances get --node-instance-id NODE_INSTANCE_ID`

Retrieve information for a single node-instance.

#### Required flags

*  `--node-instance-id=NODE_INSTANCE_ID` -
                        The ID of the node-instance to get

