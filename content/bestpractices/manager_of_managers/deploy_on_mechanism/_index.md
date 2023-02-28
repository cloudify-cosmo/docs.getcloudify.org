+++
title = "Deploy-On Mechanism"
description = "Deploy-On Mechanism"
weight = 107
alwaysopen = false
+++


#### “Deploy on” mechanism

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
    - *cloudify_password_secret_name* and *cloudify_user_secret_name*- the name of the secret which contains value of the password and the user name of {{< param product_name >}} user. 

## Verification “Deploy on” mechanism
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

## Filters, Location and Labels

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

## Resource Config

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

