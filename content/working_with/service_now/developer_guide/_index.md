+++
title = "Developer Guide: ServiceNow App"
description = "More information about ServiceNow application integration"
weight = 105
alwaysopen = false
+++

As a ServiceNow developer you can use the application exposed actions and sub-flows outside of the application.

![Flow Designer subflows]( /images/service_now/subflows.png )

![Flow Designer actions]( /images/service_now/actions.png )

*NOTE* it will require the user to have {{< param product_name >}} app roles to be able to select and provide config names from the configured configs, as it will be required in all of the actions and sub-flows as an input.

## Create Environment Catalog Item explained

In the application we use catalog client scripts to handle most of the logic that is needed to communicate with {{< param product_name >}}. Starting with config selection (which will be listed to the user) and if there is one it will be selected automatically based on the selected config. We fetch the blueprints and onChange values and fetch the blueprint inputs that don’t have default values.

You can watch this video that explain the catalog item:

<iframe src="https://player.vimeo.com/video/677206838" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>


## Using actions outside the application

In the application we have exposed a set of actions/sub-flows that can be included inside other flows or scripts if you want to create some customized flows or use them outside of the scoped application

You can watch this video that shows a simple use of the actions:

<iframe src="https://player.vimeo.com/video/674774266" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>


## Create A Flow that notify requester of environment installation status

we can use flow designer to create a custom flow to notify a user about the status of deployment installation

You can watch this video that shows a simple use of flow designer:

<iframe src="https://player.vimeo.com/video/674772805" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>


## Create A Flow and action that notify requester of environment installation status

we can use flow designer to create a custom flow and custom action to notify a user about the status of deployment installation

You can watch this video that shows a simple use of flow designer:

<iframe src="https://player.vimeo.com/video/674773387" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
