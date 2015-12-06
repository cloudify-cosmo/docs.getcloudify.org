---
layout: bt_wiki
title: SoftLayer Manager Blueprint Reference
category: Manager Blueprints
publish: false
abstract: "Reference on how to bootstrap a Cloudify manager on SoftLayer"
weight: 1000
---

{{% gsSummary %}}{{% /gsSummary %}}


{{% gsNote title="Note" %}}
This reference only explains the structure and various values in the blueprint. For better understanding of it, make yourself familiar with [Cloudify blueprints DSL](dsl-spec-general.html), the [Cloudify SoftLayer plugin](plugin-softlayer.html), and the [Manager Blueprints Authoring guide](getting-started-write-blueprint.html).
{{% /gsNote %}}

# Inputs

## Required inputs

  * `username` A SoftLayer username.
  * `api_key` A user-specific API Key.
  * `location` The name or id of the data center in which the VS should reside, e.g. *352494* the id of Hong Kong 2.
  * `domain` The domain to use for the new server, e.g. *cloudify.org*.
  * `ram` The item id of the RAM to order, e.g. *864* - the item id for 8 GB.
  * `cpu` The item id of the desired server's CPU, e.g. *859* - the item id for 4 X 2.0 GHz Cores.
  * `disk` The item id of the first disk to add, e.g. *1178* - the item id for 25 GB (SAN).
  * `os` The item id of the operating system to use, e.g. *4668* - the item id for Ubuntu Linux 14.04 LTS Trusty Tahr - Minimal Install (64 bit).
  * `ssh_keys` A list of SSH key IDs (SoftLayer IDs), to add to the root user
    * refer to the `ssh_keys` property in [Cloudify Softlayer VirtualServer](plugin-softlayer.html#cloudifysoftlayernodesvirtualserver)
  * `ssh_key_filename` The path on the local machine to the private key file that will be used with Cloudify manager and agents.
    * This private key should correspond with the public key on SoftLayer that matches an id that appears in the `ssh_keys` input.<br>

## Optional inputs

  * `endpoint_url` A softLayer endpoint URL of choice
    * Softlayer's default (if not specified) will be fine for most cases.
  * `hostname` The hostname to use for the new server
  * `image_template_global_id` An image template global id to load the server with.
  * `image_template_id` An image template id to load the server with.
  * `private_network_only` Flag to indicate whether the computing instance only has access to the private network, default to False.
  * `port_speed` The item id of the port speed
  * `private_vlan` The internal identifier of the private VLAN.
  * `public_vlan` The internal identifier of the public VLAN.
  * `provision_scripts`  A list of the URIs of the post-install scripts to run after creating the server
  * `agents_user` The username to be used when connecting into applications’ agent VMs (for agent installtion).
  * `resources_prefix` Resource prefix to be attached to cloud resources’ names.


{{% gsTip title="Tip" %}}
Some of the required inputs may actually be left empty when appropriate:

  * `username` and `api_key` properties can be left empty if the following standard SoftLayer environment variables are set:
    - *SL_USERNAME* (sets `username`)
    - *SL_API_KEY* (sets `api_key`)
  * `os` property can be left empty if one of `image_template_global_id` or `image_template_id` is specified.


Note that in order to enable this, these inputs technically have an empty (`""`) default value. This, however, does not mean they're not mandatory.

For more information see [SoftLayer plugin](plugin-softlayer.html)
{{% /gsTip %}}


# Topology

The blueprint builds the following topology on SoftLayer:

  - A server which will host the Cloudify manager.


# Nodes

The "SoftLayer manager" blueprint contains the following nodes:

  - *manager_host* - The server on which the Cloudify manager will be installed.
  - *softlayer_configuration* - A node which represents configuration settings for connecting with SoftLayer.
  - *manager* - The node which represents the manager. You may find more information about this node in the [Types Reference](reference-types.html#cloudifymanager-type) section as well as in the [Manager Blueprints Authoring guide](getting-started-write-blueprint.html).


# Configuration Operations

The *manager's* node *configure* lifecycle operation is mapped to a method in the configure.py module which takes the following actions:

  - It sets the *provider context* with the `ssh_keys`, which will be used by the SoftLayer plugin when installing applications at later stages.
  - It creates a file on the Cloudify manager server, which holds the configuration settings for connecting with SoftLayer.
    This file will be used by the SoftLayer plugin when installing applications at later stages.