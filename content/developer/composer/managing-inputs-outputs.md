---
title: Managing Inputs, Outputs and Capabilities
description: Overview on how to work with inputs, outputs and capabilities 
category: Composer
draft: false
weight: 500
aliases: /composer/managing-inputs-outputs/
---
 
{{< param cfy_composer_name >}} enables you to manage blueprint's [inputs]({{< relref "developer/blueprints/spec-inputs.md" >}}), [outputs]({{< relref "developer/blueprints/spec-outputs.md" >}}) and [capabilities]({{< relref "developer/blueprints/spec-capabilities.md" >}}).
These options are available through [project view]({{< relref "developer/composer/getting-started.md#project-view" >}}).

![Inputs and Outputs]( /images/composer/inputs-outputs.png )

## Adding an Input

1. On the **Inputs** node, enter a name and description for your input.
2. (Optional) Specify input display name and default value.
   Further optional input properties are available after expanding the input section.
   After clicking the dropdown icon on the left side of the section it is possible to provide input description as well as enable `hidden` and `required` flags.
3. (Optional) Change the default `string` data type of the input.
4. Click the Plus (+) icon to add the input to the list.

For more information about inputs, [click here]({{< relref "developer/blueprints/spec-inputs.md" >}}).


## Adding an Output

You must specify an output value in order for the deployment to pass validation.

1. On the **Outputs** node, enter a name and description for your output.
2. Specify the output value in the **Default** field.   
   You can drag the base of the field to see multiple lines, or click the edit icon next to it to display its contents in a separate window.
3. Click the Plus (+) icon to add the output to the list.


## Adding a Capability

1. On the **Capabilities** node, enter a name for your capability.
2. Specify the capability value in the **Value** field.   
   You can drag the base of the field to see multiple lines, or click the edit icon next to it to display its contents in a separate window.
3. (Optional) Add a capability description.
4. Click the Plus (+) icon to add the capability to the list.
