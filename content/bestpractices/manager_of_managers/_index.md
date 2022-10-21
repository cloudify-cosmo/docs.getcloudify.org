---
layout: bt_wiki
title: Managers of Managers
category: Manager Architecture
draft: false
abstract: Spire Manager
weight: 500
---

{{%children style="h2" description="true"%}}


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

[Installation using the Cloudify Management Console]({{< relref "managers_of_managers/exposing_submanager_ui.md" >}})

[Installation using the Cloudify API]({{< relref "managers_of_managers/exposing_submanager_api.md" >}})

[Installation using the Cloudify CLI]({{< relref "managers_of_managers/exposing_submanager_cli.md" >}})


### Required secrets

To perform correct management, you need to create also a proper [secret](https://docs.cloudify.co/latest/cli/orch_cli/secrets/) about your **all** sub managers in Spire central manager. There are two ways to connect Spire with sub managers:
- _Token_ - contains the proper value of [Cloudify token](https://docs.cloudify.co/latest/cli/orch_cli/tokens/). The token can be created with command ***cfy token create***
- _User password_ and _username_- contains the value of password and name of the user
![Secrets]( /images/mom/secrets.png )


***The name of secrets must be compatible with the secrets as inputs used in “Deploy on” mechanism.***

## 4. “Deploy on” mechanism

Depending on the connection type you can deploy the proper blueprint:
- authentication with token -> [deploy_on_token.yaml](https://github.com/cloudify-community/manager-of-managers/blob/main/deploy_on_blueprints/deploy_on_token.yaml)
- authentication with user and password -> [deploy_on_user_password.yaml](https://github.com/cloudify-community/manager-of-managers/blob/main/deploy_on_blueprints/deploy_on_user_password.yaml)

The current version of [deploy_on_token.yaml](https://github.com/cloudify-community/manager-of-managers/blob/main/deploy_on_blueprints/deploy_on_token.yaml)/[deploy_on_user_password.yaml](https://github.com/cloudify-community/manager-of-managers/blob/main/deploy_on_blueprints/deploy_on_user_password.yaml) supports public repo, to use *private repo* or *local blueprint* check chapter **7. Resource Config**.

Upload the blueprint to *SPIRE MANAGER*.
Filter (refer to chapter _6. Filters, Location and Labels_) *Environments* and click the action [**“Deploy on”**](https://docs.cloudify.co/latest/working_with/console/widgets/deploymentsview/) from **Bulk action**. The dialog appears. Select the proper blueprint and after that the inputs are visible.

![Deploy On]( /images/mom/deploy_on.png )


Inputs description:
- Required:
    - *blueprint_archive* - the URL to zip which contains all necessary files, the source must be available from the sub manager. You can find [examples here](https://github.com/cloudify-community/manager-of-managers/tree/main/blueprint_examples)
    - *blueprint_id* - the name of the blueprint with which the file is to be uploaded
    - *main_file_name* - the name of the blueprint file in zip package
    - *trust_all* - the value of ***CLOUDIFY_SSL_TRUST_ALL*** (true if the certificate is not valid or for testing purpose)
- optional (depends on authentication type):
    - *cloudify_secret_token* - the name of the secret which contains token value
    - *cloudify_password_secret_name* and *cloudify_user_secret_name*- the name of the secret which contains value of the password and the user name of Cloudify user. 

## 5. Verification “Deploy on” mechanism
To check if deployments are deployed on local managers, follow the example below/
The examples use uploaded [blueprint](https://github.com/cloudify-community/manager-of-managers/blob/main/deploy_on_blueprints/sources/deploy_on_local_blueprint.yaml) with id *blueprint_on_sub manager*.
The used inputs to *"Deploy on"* mechanism:
- *blueprint_id*=*blueprint_on_sub manager* ***Must be uploaded to local!!!***
- *cloudify_password_secret_name*=*admin_password*
- *main_file_name*=*blueprint.yaml*
- *name_of_deployment*=*local_deployment1*
- *trust_all*=*true*
- *value_of_hello*=*MyWorld*

Go to the *Services* by clicking on the button.

![SubServices]( /images/mom/subservices.png )

Verify if the ***install completed*** tile is visible in *Execution Task Graph*.

![SubService]( /images/mom/subservice.png )

You can also go to the local manager and check if deployment is installed in the *Services* tab.

![sub manager Deployment]( /images/mom/submanger_deployment.png )

***Optional [Only when inputs are exposed in Capabilities] !!!***
In this blueprint, inputs are exposed. You can check the value of capabilities.
![Local Capabilities]( /images/mom/local_capabilities.png )

## 6. Filters, Location and Labels

### Filters
Bulk action **"Deploy on"** perform actions on all accessible *Environments*. If you would like to select only a specific *sub manager*, you can use [Filters](https://docs.cloudify.co/latest/working_with/console/widgets/filters/).
You can click the **Filter** button (next to _Bulk actions_),and after that, the dialog appears.

![Filter]( /images/mom/filter.png )

Fill it in and click _Apply_

### Location
The *site* can be set in the *Deployment Metadata* of **Deploy** dialog.
![Set Site]( /images/mom/setsite.png )

To view the location of the selected _Environment_, you can click **Map** button (next to _Bulk actions_ and _Filter_), and after that the dialog appears.

![Map]( /images/mom/map.png )

### Labels
The user can specify [*Labels*](https://docs.cloudify.co/latest/developer/blueprints/spec-labels/) in the *Deployment Metadata* tile. Labels can be also set via *blueprint*.
Current *Labels* are present in *Deployment Info*.

![Labels]( /images/mom/labels.png )

The user can add a label by clicking on *Add* button.

## 7. Resource Config

Node **_cloudify.nodes.Component_** allows you to create deployment based on the blueprint which can be uploaded to the target manager (sub manager) from 3 types of resources:
- *public repo* - no additional step - [example here](https://github.com/cloudify-community/manager-of-managers/blob/main/deploy_on_blueprints/sources/deploy_on_from_public_repo.yaml)
- *private repo* - create two secrets: *github_user* and [*github_token*](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) - [example here](https://github.com/cloudify-community/manager-of-managers/blob/main/deploy_on_blueprints/sources/deploy_on_from_private_repo.yaml)
- *local blueprint* - upload blueprint (from examples) to target sub manager and proceed with **"Deploy on"** on the main manager - [example here](https://github.com/cloudify-community/manager-of-managers/blob/main/deploy_on_blueprints/sources/deploy_on_local_blueprint.yaml)

You can also specify inputs of deployments ([example here](https://github.com/cloudify-community/manager-of-managers/blob/main/deploy_on_blueprints/sources/deploy_on_local_blueprint.yaml)):
```
deployment:
  inputs:
    input0: test
    input1: {get_input: value1}
    input2: {get_secret: sec1}
```
If you use *get_secret: secret1*, you have to check if *secret1* is created.

