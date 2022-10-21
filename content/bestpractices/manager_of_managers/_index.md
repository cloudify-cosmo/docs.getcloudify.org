---
layout: bt_wiki
title: Managers of Managers
category: Manager Architecture
draft: false
abstract: Spire Manager
weight: 102
---

# Using Cloudify as a Manager of Managers  (a.k.a  MoM or Spire)
![Using Cloudify as a Manager of Managers](/images/mom/spire.png "Using Cloudify as a Manager of Managers")  
*Using Cloudify as a Manager of Managers*


The Cloudify managers of managers (Spire) feature allows control of several managers (*local managers*) from one manager (*Spire*) via the deploy-on feature.
The deploy-on feature allows users to deploy services on the discovered environments.
The deploy-on feature also provides a means to deploy the same service on multiple environments using a single command. Users can group the environments based on location, tagging and filters.
The following guide provides a step by step guide on how to install sub managers, add them to a central manager using a discovery mechanism, and deploy an application on multiple managers through a single command.


## 1. Installation of Cloudify Spire Manager

To install the ***MAIN Manager (Spire)***, please refer to the [Cloudify official documentation.](https://docs.cloudify.co/latest/install_maintain/installation/installing-manager/)

You can also check [Cloudify EC2 Provisioning](https://github.com/cloudify-community/cloudify-catalog/tree/6.4.0-build/cloudify_manager/ec2). It is the package for installing the *Cloudify Manager* on an ec2 AWS instance.

## 2. Installation of sub-managers

You can install a sub-manager in the same way as the _main manager (Spire)_. The most important thing is to make sure that your network is set up correctly (all local managers must be available for Spire Manager).

## 3. Exposing sub managers in Spire Manager

***To use local managers through the central Spire manager, you need to expose information about them in Spire via discovery blueprint. The discovery blueprint automate the process of exposing the relevant configuration properties for each manager and placing them as an environment in the Spire manager.***


### Adding sub-manager through the discovery blueprint 
First step is to deploy [manager_discovery.yaml](https://github.com/cloudify-community/manager-of-managers/blob/main/submanager_discovery/manager_discovery.yaml) with proper inputs:
- ***endpoint*** - ip of sub manager 
- ***tenant*** - name of submanagar tenant
- ***protocol*** - protocol used by sub manager
- ***port*** - number of port which sub manager is exposed

[Installation using the Cloudify Management Console]({{< relref "exposing_submanager/exposing_submanager_ui.md" >}})

[Installation using the Cloudify API]({{< relref "exposing_submanager/exposing_submanager_api.md" >}})

[Installation using the Cloudify CLI]({{< relref "exposing_submanager/exposing_submanager_cli.md" >}})


### Required secrets

To perform correct management, you need to create also a proper [secret](https://docs.cloudify.co/latest/cli/orch_cli/secrets/) about your **all** sub managers in Spire central manager. There are two ways to connect Spire with sub managers:
- _Token_ - contains the proper value of [Cloudify token](https://docs.cloudify.co/latest/cli/orch_cli/tokens/). The token can be created with command ***cfy token create***
- _User password_ and _username_- contains the value of password and name of the user
![Secrets]( /images/mom/secrets.png )


***The name of secrets must be compatible with the secrets as inputs used in “Deploy on” mechanism.***

## 4. “Deploy on” mechanism

The deploy-on feature :

* allows users to deploy services on the discovered environments.
* provides a means to deploy the same service on multiple environments using a single command. 
* Users can group the environments based on location, tagging and filters.

[Deploy On Mechanism]({{< relref "deploy_on_mechanism" >}})

{{%children style="h2" description="true"%}}