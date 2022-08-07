---
layout: bt_wiki
title: Managing Inputs, Outputs and Capabilities
description: Overview on how to work with inputs, outputs and capabilities 
category: Composer
draft: false
weight: 500
aliases: /composer/managing-inputs-outputs/
---
 
{{< param cfy_composer_name >}} enables you to add inputs and outputs to the Blueprint under the **Inputs & Outputs** node.

![Inputs and Outputs]( /images/composer/inputs-outputs.png )

_Inputs_ are parameters that are injected into a blueprint when a deployment is created. They enable you to add data that might not have been available when a blueprint was created. They also enable you to create different "flavors" of a blueprint. 

_Outputs_ provide a method to expose global aspects of a blueprint's deployment. For example, the endpoint of a server, or runtime or static information about a specific resource.

Inputs and outputs can be referenced from other parts of the topology, using the `get-input` intrinsic function.


## Adding an Input

1. On the **Inputs & Outputs** node, enter a name and description for your input.
2. (Optional) Specify an input value in the **Default** field.   
   You can drag the base of the field to see multiple lines, or click the edit icon next to it to display its contents in a separate window.
3. Select the data type from the dropdown options.
4. Click the Plus (+) icon to add the input to the list.

For more information about inputs, [click here]({{< relref "developer/blueprints/spec-inputs.md" >}}).


## Adding an Output

You must specify an output value in order for the deployment to pass validation.

1. On the **Inputs & Outputs** node, enter a name and description for your output.
2. Specify the output value in the **Default** field.   
   You can drag the base of the field to see multiple lines, or click the edit icon next to it to display its contents in a separate window.
3. Click the Plus (+) icon to add the output to the list.

## Adding an Capabilities

You must specify an capability value in order for the deployment to pass validation.

1. On the **Cpabilities** node, enter a name and description for your output.
2. Specify the output value in the **Default** field.   
   You can drag the base of the field to see multiple lines, or click the edit icon next to it to display its contents in a separate window.
3. Click the Plus (+) icon to add the output to the list.
