---
title: Create environment button
category: Widgets
draft: false
---
Allows creating a new environment.

![create_deployment_button]( /images/ui/widgets/create_environment_button.png )

Two options are available:
##### From Blueprint 

  Allows for creating an environment deployment from a selected environment blueprint. Refer to [Deploying a Blueprint]({{< relref "working_with/console/widgets/blueprints#deploying-a-blueprint" >}}) and [Create Deployment Button]({{< relref "working_with/console/widgets/deploymentButton.md" >}}) for details on deployment creation.


##### New

  Allows for creating an environment deployment from an on-the-fly created blueprint.
 
![create_deployment_modal]( /images/ui/widgets/create_environment_modal.png )

The following form fields are mandatory:

* `Name` - the name of the environment deployment to be created
* `Blueprint Name` - the name of the underlaying blueprint that will be generated

Rest of the fields are optional:

* `Blueprint Description` - description of the blueprint that will be generated
* `Capabilities` - capabilities of the blueprint that will be generated
* `Labels` - labels of the environment blueprint/deployment to be created (depending on the `Blueprint Default` checbox value) 
* `Location` - site name to be set for the environment deployment to be created

Once the `Create` button is clicked the environment blueprint will be generated and environment deployment creation modal will show up, as described in [From Blueprint]({{< relref "#from-blueprint" >}}).
Note that blueprint selection option will not be present - the blueprint to be used for environment deployment creation will be the one generated based on the provided data. 

## Settings

* `label` - The label displayed in the button. Default: 'Create Environment'
* `Color` - The color of the button. Available colors list can be found
  at: [Theming - Semantic UI React](https://react.semantic-ui.com/layouts/theming). Default: 'blue'
* `Icon` - Name of the icon displayed in the button. Available icons list can be found
  at: [Icon - Semantic UI React](https://react.semantic-ui.com/elements/icon). Default: 'add'
* `Basic button` - Allows to change button appearence, basic button is less pronounced. Default: No
