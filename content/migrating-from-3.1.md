---
layout: bt_wiki
title: Migrating from Cloudify 3.1
category: Guides
draft: false
abstract: A guide for users upgrading from Cloudify 3.1 to Cloudify 3.2
weight: 100

---
{{% gsSummary %}}{{% /gsSummary %}}

# What's changed

This release of Cloudify includes a number of major changes. For a full list, see the [Change Log]{{link here}}.
For those upgrading from 3.1, the following items are most relevant.

# Backwards incompatible changes

* The workflow's Graph framework will now raise an `api.ExecutionCancelled` error on execution cancellation, instead of returning the now-deprecated `api.EXECUTION_CANCELLED_RESULT`. This means that any workflow that used to perform additional operations after the `graph.execute()` call should now use a *try-finally* clause to handle the possible scenario of a cancelled execution.

* The Openstack plugin's `WindowsServer` type will now use the Openstack `get-password` feature by default - meaning it requires either using an image which posts the server's password to Openstack's metadata service, or disabling this behavior by setting the `use_password` property to `false`. See more information in the [Openstack plugin documentation](plugin-openstack.html#cloudifyopenstacknodeswindowsserver)

* The *Provider* API that was deprecated in Cloudify 3.1 has been removed and is no longer available.

# Something that was deprecated

* The Openstack plugin's router type supports a sugaring for passing an external network name via the `router` property (via the nested `external_gateway_info`.`network_name` key) that is now deprecated. Use the new `external_network` property of the `cloudify.openstack.Nodes.Router` type to connect a network as the gateway for a router by either the network's ID or name instead. See more information in the [Openstack plugin documentation](plugin-openstack.html).

* The `api.EXECUTION_CANCELLED_RESULT` constant is now deprecated. This constant has been in use to support graceful cancellation of workflow executions, and required workflows to return it if they had been cancelled. Instead, workflow authors should now raise an `api.ExecutionCancelled` error once execution cleanup is complete, to signal that the execution has been cancelled successfully. Note that workflows which use the Graph framework don't need to mind this as the framework will raise the relevant error (however if the error is caught by the specific workflow then it should be reraised, possibly after additional cleanups). See more information in the [Workflows authoring guide](workflows-authoring.html).

* The `cloudify.interfaces.host` interface exposed by the `cloudify.nodes.Compute` type is deprecated. This means that the interface's `get_state` operation which was used for node instances of type `cloudify.nodes.Compute` start detection by polling will be removed. An alternative for using `get_state` is described in the [Asynchronous Operations](plugins-authoring.html#asynchronous-operations) section of the plugin authoring guide.

* Cloudify operation context `ctx.operation` API has changed and instead of returning the current operation's name it returns an object with more information about the operation. The operation's name should be retrieved by referencing the `name` property of the operation's context object as follows: `ctx.operation.name`.

* [Openstack plugin's Server type](plugin-openstack.html#cloudifyopenstacknodesserver) sugaring for `image_name` and `flavor_name` under the `server` property is now deprecated. Instead, the new `image` and `flavor` *properties* should be used, as they can receive either names or IDs. Note that while these new properties are currently optional, they'll become required properties in future versions.

* [Openstack plugin's Openstack configuration's](plugin-openstack.html#openstack-configuration) `nova_url` and `neutron_url` are now deprecated. Instead, they should be provided by using `custom_configuration`, as described in the link.