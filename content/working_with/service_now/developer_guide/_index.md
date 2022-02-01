+++
title = "Developer Guide: ServiceNow App"
description = "More information about ServiceNow application integration"
weight = 105
alwaysopen = false
+++

As a ServiceNow developer you can use the application exposed actions and sub-flows outside of the application.

*NOTE* it will require the user to have Cloudify app roles to be able to select and provide config names from the configured configs, as it will be required in all of the actions and sub-flows as an input.

## Create Environment Catalog Item explained

In the application we use catalog client scripts to handle most of the logic that is needed to communicate with Cloudify. Starting with config selection (which will be listed to the user) and if there is one it will be selected automatically based on the selected config. We fetch the blueprints and onChange values and fetch the blueprint inputs that don’t have default values.

<!---the following video will go through how the integration is used inside the application

<iframe src="https://drive.google.com/file/d/1yV87XDCcKC7cjdT2yDLwJwBNFcRWDACB/view" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>-->


## Using actions outside the application

In the application we have exposed a set of actions/sub-flows that can be included inside other flows or scripts if you want to create some customized flows or use them outside of the scoped application

![Flow Designer subflows]( /images/service_now/subflows.png )

![Flow Designer actions]( /images/service_now/actions.png )


<!---the following video will go through an example of how to use an action outside the application

<iframe src="https://drive.google.com/file/d/1wRKbLu-KntARRCfclLCM2cIFalN5lZgW/view" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>


## Create A Flow that notify requester of environment installation status

the following video will go through an example of how we can use flow designer

<iframe src="https://drive.google.com/file/d/1ALcLE_hZlMM83pgZpSXW5MCNdD_7oi1W/view" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>


## Create A Flow that notify requester of environment installation status

the following video will go through an example of how we can use flow designer with custom action

<iframe src="https://drive.google.com/file/d/1_vRT7tQMcafSIdD3-Z1l5RiCwe89GsAp/view" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>-->
