---
title: Google Cloud Plugin
category: Official Plugins
description: The GCP plugin enables you to manage cloud resources on GCP
draft: false
weight: 120
aliases:
  - /plugins/gcp/
  - /developer/official_plugins/gcp/
---


The GCP plugin enables you to use {{< param product_name >}} to manage Cloud resources on GCP. The currently supported resource types are listed later in this topic.

Note that some services and resources vary in availability between regions and accounts.


# Plugin Requirements

* Python versions:
  * 2.7.x
* [GCP](https://cloud.google.com/) account


# Compatibility

The GCP plugin uses the official [Google API Python Client](https://github.com/google/google-api-python-client).


## Accessing Secrets

 It is recommended that you store your credentials as [secrets]({{< relref "working_with/manager/using-secrets.md" >}}). You can do this using the [CLI]({{< relref "cli/orch_cli/secrets.md" >}}).
 Secrets can then be accessed inside your blueprints, as follows:

 {{< highlight  yaml  >}}
  network:
    type: cloudify.gcp.nodes.Network
    properties:
      gcp_config:
        auth:
          type: service_account
          auth_uri: https://accounts.google.com/o/oauth2/auth
          token_uri: https://accounts.google.com/o/oauth2/token
          auth_provider_x509_cert_url: https://www.googleapis.com/oauth2/v1/certs
          client_x509_cert_url: { get_secret: gcp_client_x509_cert_url }
          client_email: { get_secret: gcp_client_email }
          client_id: { get_secret: gcp_client_id }
          project_id: { get_secret: gcp_project_id }
          private_key_id: { get_secret: gcp_private_key_id }
          private_key: { get_secret: gcp_private_key }
        project: { get_secret: gcp_project_id }
        zone: { get_secret: gcp_zone }
      name: my_cloudify_network
      auto_subnets: false
 {{< /highlight >}}   

# GCP Plugin Configuration

The GCP plugin requires Service Account credentials and endpoint setup information in order to authenticate and interact with Google Cloud Provider. This is retrieved from your Google Cloud account.

To locate these credentials, nagivate to: [APIs & Services::Credentials](https://console.cloud.google.com/apis/credentials).

  * Select "Service Account Key" from the "Create Credentials" menu.
  * From the "Service account" menu, select the appropriate account, for example, "Compute Engine default service account".
  * Download the JSON key type.
  * You can now read the appropriate values from the JSON file in your downloads folder.
  * To use a CLI to create secrets, use the following commands:

```bash
#!/bin/bash

export service_account_keys=/vagrant/service-account-keys.json

cfy secrets create gcp_client_x509_cert_url -u -s `cat ${service_account_keys} | jq -r '.client_x509_cert_url'`
cfy secrets create gcp_client_email -u -s `cat ${service_account_keys} | jq -r '.client_email'`
cfy secrets create gcp_client_id -u -s `cat ${service_account_keys} | jq -r '.client_id'`
cfy secrets create gcp_project_id -u -s `cat ${service_account_keys} | jq -r '.project_id'`
cfy secrets create gcp_private_key_id -u -s `cat ${service_account_keys} | jq -r '.private_key_id'`
cfy secrets create gcp_region -u -s us-east1
cfy secrets create gcp_zone -u -s us-east1b
cat ${service_account_keys} | jq -r '.private_key' | sed '$d' >> gcp-private-key
cfy secrets create gcp_private_key -u -f gcp-private-key
rm gcp-private-key

```

Google's credential JSON file stores the private key as a string with `\n` string literals instead of line breaks. Before creating your `gcp_private_key` secret, the value needs to be transformed. Manually change this value, perform find and replace, or find another solution. Also, in the UI create secrets widget, do not use the text field store the key, rather upload the key as a file. CLI users can use the solution in the script above.

Another option to provide the credentials is to download the service account JSON key and store it and the gcp_zone as a secrets, as follows:
{{< highlight  bash  >}}
cfy secrets create gcp_credentials  -f <path_to_gcp_service_acoount_json>  
cfy secrets create gcp_zone -s <gcp_zone>
{{< /highlight >}}

then your blueprint should look like that:

{{< highlight  yaml  >}}
  network:
    type: cloudify.gcp.nodes.Network
    properties:
      gcp_config:
        auth: {get_secret: gcp_credentials}
        zone: { get_secret: gcp_zone }
      name: my_cloudify_network
      auto_subnets: false
 {{< /highlight >}}   


**Note:**
{{< highlight  bash  >}}
cfy secrets create gcp_credentials -s <service_acocount_json_as_string>
can be used instead of
cfy secrets create gcp_credentials  -f <path_to_gcp_service_acoount_json>
{{< /highlight >}}
.

# Terminology

* Region refers to a general geographical area, such as "Central Europe" or "East US".
* Zone refers to a distinct area within a region. Zones are usually referred to as '{region}-{zone}, i.e. 'us-east1-b' is a zone within the reigon 'us-east1'.


# Types

The following are [node type]({{< relref "developer/blueprints/spec-node-types.md" >}}) definitions. Nodes describe resources in your cloud infrastructure. For more information, see [node type]({{< relref "developer/blueprints/spec-node-types.md" >}}).

## Common Properties

All cloud resource nodes have common properties:

**Properties**

Every time you manage a resource with {{< param product_name >}}, it creates one or more connections to the GCP API.
You specify the configuration for these clients using the `gcp_config` property.

It should be a dictionary, with the following values:

  * `project` - The name of your project on GCP.
  * `zone` - The default zone that will be used,
    unless overridden by a defined zone/subnetwork.
  * `auth` - The JSON key file provided by GCP.
    Can either be the contents of the JSON file, or a file path.
    This should be in the format provided by the GCP credentials JSON export (https://developers.google.com/identity/protocols/OAuth2ServiceAccount#creatinganaccount)
  * (optional) `network` - The default network in which to place network-scoped nodes.
    The default network (`default`) is used if this value is not specified.

Example
{{< highlight  yaml  >}}
...
node_types:
  my_vm:
    type: cloudify.gcp.nodes.Instance
    properties:
      image_id: <GCP image ID>
      gcp_config:
        project: a-gcp-project-123456
        zone: us-east1-b
        auth: <GCP auth JSON file>
{{< /highlight >}}


### Using Existing Resources

All GCP {{< param product_name >}} node types have the properties `use_external_resource` and `resource_id`. If `use_external_resource` is set to `true`, then the plugin will attempt to locate the resource specified in `resource_id` and use it. An older method is still supported: the required properties for that type `name`, and sometimes `region` or `zone`, are used to look up an existing resource in the GCP project. If the entity is discovered, its data is used to populate the {{< param product_name >}} instance's attributes (`runtime_properties`). If it is not found, the blueprint fails to deploy.

This behavior is common to all resource types that support `use_external_resource`:

 * `create` - If `use_external_resource` is `true`, the GCP plugin checks if the resource is available in your account. If no such resource is available, the operation fails. If it is available, the operation assigns the resource details to the `runtime_properties` instance.
 * `delete` - If `use_external_resource` is `true`, the GCP plugin checks if the resource is available in your account. If no such resource is available, the operation fails. If it is available, the operation unassigns the `runtime_properties` instance.


## Runtime Properties

See section on [runtime properties](http://cloudify-plugins-common.readthedocs.org/en/3.3/context.html?highlight=runtime#cloudify.context.NodeInstanceContext.runtime_properties)

Most node types will write a snapshot of the `resource` information from GCP when the node creation has finished (some, e.g. DNSRecord don't correspond directly to an entity in GCP, so this is not universal).


# Node Types

## cloudify.gcp.nodes.Address
**Derived From:** cloudify.gcp.nodes.GlobalAddress

A GCP Address. This can be connected to a cloudify.gcp.nodes.Instance type using the `cloudify.gcp.relationships.instance_connected_to_ip` relationship type.



**Properties:**


  * `gcp_config` - A dictionary of values to pass to authenticate with the GCP API.

    *default:* {}
  * `region` - Region to place the Address in. If not provided it defaults to the value in `gcp_config` (which defaults to 'default').

    *default:*





## cloudify.gcp.nodes.BackendService
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

A group of cloudify.gcp.nodes.Instance types (contained within InstanceGroups) that can be used as the back end for load balancing.



**Properties:**


  * `gcp_config` - A dictionary of values to pass, to authenticate with the GCP API.

    *default:* {}
  * `additional_settings` - Optional additional settings. Possible fields in dictionary are: `port_name`, `protocol`, `timeout_sec`.

    *default:* {}
  * `health_check` - URL of a health check assigned to this backend service.

    *type:* string
    *default:*
  * `use_external_resource` - Indicates whether the resource exists and use existing (true) or if {{< param product_name >}} should create new resource (false).

    *type:* boolean
    *default:* False
  * `name` - Optional health check name. By default it is the backend service ID.

    *type:* string
    *default:*





## cloudify.gcp.nodes.DNSAAAARecord
**Derived From:** cloudify.gcp.nodes.DNSRecord

`AAAA` type DNSRecord



**Properties:**


  * `type`


    *default:* AAAA





## cloudify.gcp.nodes.DNSMXRecord
**Derived From:** cloudify.gcp.nodes.DNSRecord

`MX` type DNSRecord



**Properties:**


  * `type`


    *default:* MX





## cloudify.gcp.nodes.DNSNSRecord
**Derived From:** cloudify.gcp.nodes.DNSRecord

`NS` type DNSRecord



**Properties:**


  * `type`


    *default:* NS





## cloudify.gcp.nodes.DNSRecord
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

Corresponds to a specific subdomain (or `@` for the root) and record-type in the containing DNSZone.

for example, the `A` record for `special_service.getcloudify.org`.

A number of convenience types are provided that update the default type (see DNSAAAARecord, DNSMXRecord, DNSTXTRecord, DNSNSRecord).



**Properties:**


  * `gcp_config` -
    A dictionary of values to pass, to authenticate with the GCP API.

    *default:* {}
  * `type` -
    The type of this DNS record. Only one record of each type with the same name is allowed within a zone.

    *type:* string
    *default:* A
  * `name` -
    The subdomain. This is prepended to the DNSZone's `dns_name`, to produce the full domain name for this record. Defaults to the instance ID.

    *type:* string
    *default:*
  * `resources` -
    List of resources that will form this record. (Can be augmented using
      `cloudify.gcp.relationships.dns_record_connected_to_instance`
      and
      `cloudify.gcp.relationships.dns_record_connected_to_ip` relationships.
      )

    *default:* []
  * `ttl` -
    DNS entry Time To Live.

    *type:* integer
    *default:* 86400



### Example

{{< highlight  yaml  >}}

www:
  type: cloudify.gcp.nodes.DNSRecord
  properties:
    resources: [10.11.12.13, 8.9.10.11]
  relationships:
    - type: cloudify.gcp.relationships.dns_record_contained_in_zone
      target: my_zone

mx:
  type: cloudify.gcp.nodes.DNSMXRecord
  properties:
    name: mail
  relationships:
    - type: cloudify.gcp.relationships.dns_record_contained_in_zone
      target: my_zone
    - type: cloudify.gcp.relationships.dns_record_connected_to_instance
      target: my_instance

{{< /highlight >}}

The DNSRecord type can be connected to a `cloudify.gcp.nodes.Instance` (using `cloudify.gcp.relationships.dns_record_connected_to_instance`), or to a `cloudify.gcp.nodes.IPAddress` (using `cloudify.gcp.relationships.dns_record_connected_to_ip`). Each instance or IP address node that is connected will have its public IP address added to the list of resources for this record.



## cloudify.gcp.nodes.DNSTXTRecord
**Derived From:** cloudify.gcp.nodes.DNSRecord

`TXT` type DNSRecord



**Properties:**


  * `type`


    *default:* TXT





## cloudify.gcp.nodes.DNSZone
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

A Cloud DNS zone.

Represents a specific DNS domain that you want to manage through Google Cloud DNS.
DNS nameservers can vary between different DNSZones. To find the correct nameserver entries for your domain, use the `nameServers` attribute from the created zone.



**Properties:**


  * `dns_name` -
    (Fully qualified) domain name of the zone. Defaults to the instance ID.

    *type:* string
    *default:*
  * `additional_settings` -
    Additional settings

    *default:* {}
  * `use_external_resource` -
    Indicates whether the resource exists and should be used (`true`), or if {{< param product_name >}} should create a new resource (`false`).

    *type:* boolean
    *default:* False
  * `name` -
    (Internal) name of the zone. Defaults to the instance ID.

    *type:* string
    *default:*
  * `gcp_config` -
    A dictionary of values to pass, to authenticate with the GCP API.

    *default:* {}



### Example

{{< highlight  yaml  >}}

my_zone:
  type: cloudify.gcp.nodes.DNSZone
  properties:
    dns_name: getcloudify.org.

{{< /highlight >}}

The supplied `dns_name` must be a fully-qualified domain name with the trailing dot. The output attributes (`runtime_properties`) will include a key `nameServers` that contains the list of nameservers to be supplied as nameservers with the domain registrar.



## cloudify.gcp.nodes.ExternalIP
**Derived From:** [cloudify.nodes.VirtualIP]({{< relref "developer/blueprints/built-in-types.md" >}})

Use this together with the `cloudify.gcp.relationships.instance_connected_to_ip` if you want the instance to have an ephemeral external IP address.



**Properties:**


  * `gcp_config` -
    A dictionary of values to pass, to authenticate with the GCP API.

    *default:* {}
  * `ip_address` -
    Address of this external IP. This should be the address of an already existing, unattached, static IP. It is used only if `use_external_resource` is set to `true`.

    *type:* string
    *default:*
  * `use_external_resource` -
    Indicates whether the resource exists or if {{< param product_name >}} should create the resource. If set to `true`, this node is the static IP address, otherwise it is the ephemeral IP address.

    *type:* boolean
    *default:* False





## cloudify.gcp.nodes.FirewallRule
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

A GCP FirewallRule.

This describes permitted traffic that is directed to either the entire specified network, or to Instances specified by matching tags.



**Properties:**


  * `sources` -
    A list of CIDR-formatted ranges and instance tags that
    are permitted to connect to targets by this rule
    e.g.:.
      - 10.100.101.0/24
      - a-tag

    *required* None
  * `additional_settings` -
    Additional settings for the firewall.

    *default:* {}
  * `name` -
    Optional security group name. By default it is thee network name plus node name.

    *default:*
  * `allowed` -
    Dictionary of permitted ports per protocol, in the form
      protocol: [port, ...]
    If no ports are specified, all ports are opened for that protocol. For example,
      tcp: 80, 443
      udp:

    *required* None
  * `gcp_config` -
    A dictionary of values to pass, to authenticate with the Google Cloud Platform API.

    *default:* {}
  * `target_tags` -
    A list of target tags to which this rule applies. If no tags are specified, it applies to all instances in the network

    *default:* []
  * `use_external_resource` -
    Indicates whether the resource exists, or if {{< param product_name >}} should create the resource.

    *type:* boolean
    *default:* False



### Example

{{< highlight  yaml  >}}

allow_ssh:
  type: cloudify.gcp.nodes.FirewallRule
  properties:
    sources: [0.0.0.0/0]
    allowed:
      tcp: [22]

allow_http_to_http_tag:
  type: cloudify.gcp.nodes.FirewallRule
  properties:
    sources: [0.0.0.0/0]
    allowed:
      tcp: [80]
    target_tags: [http]

http_instance:
  type: cloudify.gcp.nodes.Instance
  properties:
    tags: [http]
    ...

{{< /highlight >}}





## cloudify.gcp.nodes.GlobalAddress
**Derived From:** [cloudify.nodes.VirtualIP]({{< relref "developer/blueprints/built-in-types.md" >}})

A GCP GlobalAddress.

You can only use `GlobalAddress` together with `GlobalForwardingRule`. To connect a static IP address to an Instance, use `StaticIP`.



**Properties:**


  * `gcp_config` -
    A dictionary of values to pass, to authenticate with the GCP API.

    *default:* {}
  * `additional_settings` -
    Additional settings for a static IP address.

    *default:* {}
  * `use_external_resource` -
    Indicates whether the resource exists, or if {{< param product_name >}} should create the resource. If set to `true`, this node is an already existing static IP address, otherwise it is a reserved static IP address.

    *type:* boolean
    *default:* False
  * `name` -
    An optional static IP name. By default it is the static IP ID.

    *type:* string
    *default:*





## cloudify.gcp.nodes.GlobalForwardingRule
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

A GCP GlobalForwardingRule.

Can only be used in conjunction with a GlobalAddress to set up HTTP and HTTPS forwarding.



**Properties:**


  * `port_range` -
    The port number that is used by this forwarding rule. If packets are redirected to the HTTP proxy, possible values are `80` and `8080`. In the case of an HTTPS proxy, the only valid value is `443`.

    *type:* string
    *default:* 80
  * `additional_settings` -
    Additional settings for the SSL certificate.

    *default:* {}
  * `name` -
    An optional global forwarding rule name. By default it is the global forwarding rule ID.

    *type:* string
    *default:*
  * `target_proxy` -
    The URL of a target proxy (HHTP or HTTPS) that receives traffic coming from specified IP address.

    *type:* string
    *default:*
  * `gcp_config` -
    A dictionary of values to pass, to authenticate with the GCP API.

    *default:* {}
  * `ip_address` -
    The IP address associated with this forwarding rule. This address must have been reserved earlier.

    *type:* string
    *default:*
  * `use_external_resource` -
    Indicates whether the resource exists and is to be used (`true`), or if {{< param product_name >}} should create new resource (`false`).

    *type:* boolean
    *default:* False





## cloudify.gcp.nodes.HealthCheck
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

A GCP HealthCheck.

This describes a method that a TargetProxy can use to verify that specific backend Instances are functioning. Backends that fail the health check verification are removed from the list of candidates.



**Properties:**


  * `gcp_config` -
    A dictionary of values to pass, to authenticate with the GCP API.

    *default:* {}
  * `additional_settings` -
    Optional additional settings. Possible fields in the dictionary are: `port`, `request_path`, `timeout_sec`, `check_interval_sec`, `healthy_threshold`, `unhealthy_threshold`.

    *default:* {}
  * `health_check_type`
    This field indicates if this health check is an HTTP- or HTTPS-based health check. Possible values are: `http` and `https`.

    *type:* string
    *default:* http
  * `use_external_resource` -
    Indicates whether the resource exists and is to be used (`true`), or if {{< param product_name >}} should create new resource (`false`).

    *type:* boolean
    *default:* False
  * `name` -
    An optional health check name. By default it is the health check ID.

    *type:* string
    *default:*





## cloudify.gcp.nodes.Image
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

A stored image that can be used as the base for new Instances.



**Properties:**


  * `image_name` -
    The name to use for the image. Defaults to the instance ID.

    *default:*
  * `gcp_config` -
    A dictionary of values to pass, to authenticate with the GCP API.

    *default:* {}
  * `additional_settings` -
    Additional settings for the image.

    *default:* {}
  * `image_path` -
    The (local system) path to the image file that will be uploaded.

    *default:*
  * `use_external_resource` -
    Indicates whether the resource exists or if {{< param product_name >}} should create the resource.

    *type:* boolean
    *default:* False





## cloudify.gcp.nodes.Instance
**Derived From:** [cloudify.nodes.Compute]({{< relref "developer/blueprints/built-in-types.md" >}})

A GCP Instance (i.e. a VM).


**Properties:**


  * `scopes` -
    Optional scopes. If not specified, it is set by default:  'https://www.googleapis.com/auth/devstorage.read_write', 'https://www.googleapis.com/auth/logging.write'

    *default:* []
  * `instance_type` -
    The instance's type. All available instance types can be found here:  https://cloud.google.com/compute/docs/machine-types

    *type:* string
    *default:* n1-standard-1
  * `name` -
    An optional instance name. By default it is the instance ID.

    *type:* string
    *default:*
  * `zone` -
    An optional zone name. If not specified, this instance is deployed in the default zone.

    *type:* string
    *default:*
  * `tags` -
    Optional tags. If not specified, this instance has a tag only with its name.

    *type:* string
    *default:*
  * `external_ip` -
    Specifies whether the Instance is to be created with an externally-accessible IP address. The address will be an ephemeral IP. ITo use an IP address that can be transferred to another Instance, connect this Instance to an `Address` node using the `cloudify.gcp.relationships.instance_connected_to_ip` relationship.

    *type:* boolean
    *default:* False
  * `gcp_config` -
    A dictionary of values to pass, to authenticate with the GCP API.

    *default:* {}
  * `block_project_ssh_keys` -
    Disables project-wide SSH keys for this Instance.

    *type:* boolean
    *default:* False
  * `image_id` -
    The ID of the image in your GCP account.

    *type:* string
    *default:* {}
  * `additional_settings` -
    Additional instance settings.

    *default:* {}
  * `startup_script` -
    A script that is run when the Instance is first started. For example,
      type: string
      script: |
        yum install some stuff
        systemctl start it
    or:
      type: file
      script: <path to script file>

    *default:*
  * `can_ip_forward` -
    Specifies whether the VM is permitted to send packets with a source address that is different to its own.

    *type:* boolean
    *default:* False
  * `use_external_resource` -
    Indicates whether the resource exists and is to be used (`true`),  or if {{< param product_name >}} should create new resource (`false`).

    *type:* boolean
    *default:* False



### Example

{{< highlight  yaml  >}}

my_gcp_instance:
  type: cloudify.gcp.nodes.Instance
  properties:
    image_id: http://url.to.your.example.com/image
    instance_type: n1-standard-1
    gcp_config:
      project: your-project
      network: default
      zone: us-east1-b
      auth: path_to_auth_file.json

{{< /highlight >}}

This example includes actions of adding additional parameters, tagging an instance name, and explicitly defining the `gcp_config`.




## cloudify.gcp.nodes.InstanceGroup
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

A GCP InstanceGroup.
This is used to configure failover systems. You can configure InstanceGroups to scale automatically, based on load, and to replace failing Instances with freashly started ones.


**Properties:**


  * `gcp_config` -
    A dictionary of values to pass, to authenticate with the GCP API.

    *default:* {}
  * `additional_settings` -
    Additional settings for an instance group.

    *default:* {}
  * `use_external_resource` -
    Indicates whether the resource exists and is to be used (`true`) or if {{< param product_name >}} should create new resource (`false`).

    *type:* boolean
    *default:* False
  * `name` -
    An optional instance name. By default it is the instance group ID.

    *type:* string
    *default:*
  * `named_ports` -
    A list of named ports defined for this instance group. The expected format is: [{name: `name`, port: `1234`}, ... ].

    *default:* []





## cloudify.gcp.nodes.KeyPair
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

An SSH key-pair which will be uploaded to any Instances connected to it via `cloudify.gcp.relationships.instance_connected_to_keypair`.

Unlike other cloud providers, users are dynamically created on Instances based on the username specified by the uploaded SSH key, so the public key text must include a username in the comment section (keys generated using `ssh-keygen` have this by default).



**Properties:**


  * `private_key_path`
    The path where the key should be saved on the machine. If this will run on the manager, this will be saved on the manager.

    *type:* string
    *default:*
  * `public_key_path`
    The path to read from existing public key.

    *type:* string
    *default:*
  * `user`
    The user account for this key. A corresponding user account will be created by GCP when the key is added to the Instance. This must be supplied for a non-external resource key. See https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys

    *type:* string
    *default:*
  * `gcp_config`
    A dictionary of values to pass to authenticate with the Google Cloud Platform API.

    *default:* {}
  * `use_external_resource`
    Indicate whether the resource exists or if {{< param product_name >}} should create the resource.

    *type:* boolean
    *default:* False





## cloudify.gcp.nodes.Network
**Derived From:** [cloudify.nodes.Network]({{< relref "developer/blueprints/built-in-types.md" >}})

A GCP Network. This supports either auto-assigned or manual subnets. Legacy networks are not supported. See the GCP Manager and Networks section below if you plan to run a {{< param cfy_manager_name >}} on GCP.



**Properties:**


  * `gcp_config`
    A dictionary of values to pass to authenticate with the Google Cloud Platform API.

    *default:* {}
  * `auto_subnets`
    Whether to use the GCP "autoCreateSubnetworks" feature (see https://cloud.google.com/compute/docs/subnetworks#networks_and_subnetworks)

    *default:* True
  * `additional_settings`
    Additional setting for network

    *default:* {}
  * `name`
    Optional Network name. The instance ID will be used by default.

    *default:*
  * `use_external_resource`
    Indicate whether the resource exists or if {{< param product_name >}} should create the resource.

    *type:* boolean
    *default:* False



### Example

{{< highlight  yaml  >}}

my_net:
  type: cloudify.gcp.nodes.Network

{{< /highlight >}}





## cloudify.gcp.nodes.Route
**Derived From:** [cloudify.nodes.Router]({{< relref "developer/blueprints/built-in-types.md" >}})

A defined route, which will be added to the specified network.
If tags are specified, it will only be added to Instances matching them.



**Properties:**


  * `dest_range`
    The outgoing range that this route will handle

    *required* None
  * `priority`
    The routing table priority for this route. Routes with lower priority numbers will be chosen first if more than one route with a matching prefix of the same length.

    *default:* 1000
  * `additional_settings`
    Additional setting for firewall

    *default:* {}
  * `next_hop`
    The Instance, IP or VpnTunnel which will handle the matching packets

    *default:*
  * `name`
    Optional Route name. The instance ID will be used by default.

    *default:*
  * `tags`
    Instance tags that this route will be applied to

    *default:* []
  * `gcp_config`
    A dictionary of values to pass to authenticate with the Google Cloud Platform API.

    *default:* {}





## cloudify.gcp.nodes.SecurityGroup
**Derived From:** [cloudify.nodes.SecurityGroup]({{< relref "developer/blueprints/built-in-types.md" >}})

A virtual SecurityGroup.

Google Cloud Platform has no entity equivalent to a Security Group on AWS or OpenStack, so as a convenience {{< param product_name >}} includes a virtual one. It is implemented behind the scenes using a specially constructed tag and a number of FirewallRules.



**Properties:**


  * `rules`
    List of FirewallRules which will form this SecurityGroup. Only the `sources:` and `allowed:` fields should be supplied (see FirewallRule properties for details).

    *default:* []
  * `gcp_config`
    A dictionary of values to pass to authenticate with the Google Cloud Platform API.

    *default:* {}
  * `name`
    Optional security group name. By default it will be network name plus node name.

    *default:*





## cloudify.gcp.nodes.SslCertificate
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

A TLS/SSL certificate and key. This will be used by a HTTPS TargetProxy to provide authenticated encryption for connecting users.



**Properties:**


  * `private_key`
    Dictionary describing private key in PEM format used to generate this SSL certificate. Expected format is:
      type: text|file
      data: Private key in PEM format if text, otherwise path to a file with private key

    *default:* {}
  * `name`
    Optional SSL certificate name. By default it will be SSL certificate id.

    *type:* string
    *default:*
  * `certificate`
    Certificate (self-signed or obtained from CA) in PEM format. Expected format is:
      type: text|file
      data: Certificate in PEM format if text, otherwise path to a file with certificate

    *default:* {}
  * `gcp_config`
    A dictionary of values to pass to authenticate with the GCP API.

    *default:* {}
  * `additional_settings`
    Additional setting for target proxy

    *default:* {}
  * `use_external_resource`
    Indicate whether the resource exists and use existing (true) or if {{< param product_name >}} should create new resource (false).

    *type:* boolean
    *default:* False





## cloudify.gcp.nodes.StaticIP
**Derived From:** cloudify.gcp.nodes.GlobalAddress

Alias for GlobalAddress for backward compatibility.



**Properties:**







## cloudify.gcp.nodes.SubNetwork
**Derived From:** [cloudify.nodes.Subnet]({{< relref "developer/blueprints/built-in-types.md" >}})

A GCP Subnetwork. Must be connected to a Network using `cloudify.gcp.relationships.contained_in_network`.

Only networks with the `auto_subnets` property disabled can be used.



**Properties:**


  * `subnet`
    The subnet, denoted in CIDR form (i.e. '10.8.0.0/20') Subnets must be unique and non-overlapping within a project. See https://cloud.google.com/compute/docs/subnetworks#networks_and_subnetworks

    *type:* string
    *default:*
  * `region`
    The region this subnet is in. See https://cloud.google.com/compute/docs/regions-zones/regions-zones

    *type:* string
    *default:*
  * `use_external_resource`
    Indicate whether the resource exists or if {{< param product_name >}} should create the resource.

    *type:* boolean
    *default:* False
  * `name`
    Optional SubNetwork name. The instance ID will be used by default.

    *default:*
  * `gcp_config`
    A dictionary of values to pass to authenticate with the Google Cloud Platform API.

    *default:* {}



### Example

{{< highlight  yaml  >}}

my_net:
  type: cloudify.gcp.nodes.Network
  properties:
    auto_subnets: false

my_subnet:
  type: cloudify.gcp.nodes.SubNetwork
  properties:
    subnet: 10.8.0.0/20
  relationships:
    - type: cloudify.gcp.relationships.contained_in_network
      target: my_net

my_instance:
  type: cloudify.gcp.nodes.Instance
  properties:
    ...
  relationships:
    - type: cloudify.gcp.relationships.contained_in_network
      target: my_subnet

{{< /highlight >}}

If you want to use an exsisting SubNetwork (`use_external_resource: true`) then you must supply the `name` and `region` properties. This is because SubNetwork names are not unique across the whole project, only within a region.




## cloudify.gcp.nodes.TargetProxy
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

A TargetHttpProxy or TargetHttpsProxy.

Specify which using the `target_proxy_type` property.



**Properties:**


  * `ssl_certificate`
    URL of a SSL certificate associated with this target proxy. Can and must be used only with https type proxy.

    *type:* string
    *default:*
  * `additional_settings`
    Additional setting for target proxy

    *default:* {}
  * `name`
    Optional target proxy name. By default it will be target proxy id.

    *type:* string
    *default:*
  * `target_proxy_type`
    This field indicates if this target proxy is a HTTP or HTTPS based target proxy. Possible values are: 'http' and 'https'.

    *type:* string
    *default:* http
  * `gcp_config`
    A dictionary of values to pass to authenticate with the GCP API.

    *default:* {}
  * `url_map`
    URL of a URL map which specifies how traffic from this target proxy should be redirected.

    *type:* string
    *default:*
  * `use_external_resource`
    Indicate whether the resource exists and use existing (true) or if {{< param product_name >}} should create new resource (false).

    *type:* boolean
    *default:* False





## cloudify.gcp.nodes.UrlMap
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

Maps URLs to BackendServices



**Properties:**


  * `default_service`
    URL of a backend service to which this URL map will redirect traffic by default.

    *type:* string
    *default:*
  * `gcp_config`
    A dictionary of values to pass to authenticate with the GCP API.

    *default:* {}
  * `additional_settings`
    Additional setting for url map

    *default:* {}
  * `use_external_resource`
    Indicate whether the resource exists and use existing (true) or if {{< param product_name >}} should create new resource (false).

    *type:* boolean
    *default:* False
  * `name`
    Optional health check name. By default it will be URL map id.

    *type:* string
    *default:*





## cloudify.gcp.nodes.Volume
**Derived From:** [cloudify.nodes.Volume]({{< relref "developer/blueprints/built-in-types.md" >}})

A GCP Volume.

A virtual disk which can be attached to Instances.



**Properties:**


  * `additional_settings`
    Additional setting for volume

    *default:* {}
  * `name`
    Optional disk name. By default it will be disk id.

    *type:* string
    *default:*
  * `gcp_config`
    A dictionary of values to pass to authenticate with the Google Cloud Platform API.

    *default:* {}
  * `image`
    The image of the Volume.

    *default:*
  * `use_external_resource`
    Indicate whether the resource exists or if {{< param product_name >}} should create the resource.

    *type:* boolean
    *default:* False
  * `size`
    Size of the Volume in GB.

    *type:* integer
    *default:* 10



## **cloudify.gcp.nodes.KubernetesCluster**
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

This node type refers to a GCP GKE Cluster.


**Properties:**


* `gcp_config`
    A dictionary of values to pass to authenticate with the Google Cloud Platform API.

    *default:* {}

* `name`
 Kubernetes cluster name.

    *type:* string
    *default:* ''


* `additional_settings`
    Additional setting for instance group

    *default*: {}



* `use_external_resource`
    Indicate whether the resource exists or if {{< param product_name >}} should create the resource,
    true if you are bringing an existing resource, false if you want {{< param product_name >}} to create it.

    *type:* boolean

    *default:* false

* `resource_id`
    The GCP resource ID of the external resource, if
    use_external_resource is true. Otherwise it is an empty string.      

    *type:* string

    *default:* ''



### Cluster Example

**Creates a new GKE Cluster**

```yaml
  kubernetes-cluster:
    type: cloudify.gcp.nodes.KubernetesCluster
    properties:
      name: { concat: [ { get_input: resource_prefix }, '-cluster']}
      gcp_config: *gcp_config
```

## **cloudify.gcp.nodes.KubernetesNodePool**
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

This node type reefers to Node pool in a GKE cluster.

**Properties:**


* `gcp_config`
    A dictionary of values to pass to authenticate with the Google Cloud Platform API.

    *default:* {}

* `name`
  Node Pool name of Kubernetes cluster.

    *type:* string

    *default:* ''

* `cluster_id`
    Kubernetes cluster name (id)

    *type:* string

    *required:* true

* `additional_settings`
    Additional setting for instance group

    *default:* {}

* `use_external_resource`
    Indicate whether the resource exists or if {{< param product_name >}} should create the resource,
    true if you are bringing an existing resource, false if you want cloud{{< param product_name >}}ify to create it.

    *type:* boolean

    *default:* false

* `resource_id`
    The GCP resource ID of the external resource, if
    use_external_resource is true. Otherwise it is an empty string.      

    *type:* string

    *default:* ''

### Nodepool Example
```yaml
  kubernetes-cluster-node-pool:
    type: cloudify.gcp.nodes.KubernetesNodePool
    properties:
      name: { concat: [ { get_input: resource_prefix }, '-node-pool-1']}
      cluster_id: { get_property: [ kubernetes-cluster, name] }
      additional_settings:
        config:
          machineType: n1-standard-2
        initialNodeCount: 2
        autoscaling:
          enabled: true
          minNodeCount: 2
          maxNodeCount: 5
      gcp_config: *gcp_config
    relationships:
      - type: cloudify.relationships.depends_on
        target: kubernetes-cluster
```

## **cloudify.gcp.nodes.KubernetesClusterMonitoring**
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

This node type refers to a GKE cluster monitoring service.

**Properties:**

* `gcp_config`
    A dictionary of values to pass to authenticate with the Google Cloud Platform API.

    *default:* {}

* `monitoring_service`
    The monitoring service the cluster should use to write metrics.

    Currently available options:

    "monitoring.googleapis.com" - the Google Cloud Monitoring service

    "none" - no metrics will be exported from the cluster

    *type:* string

    *default:* 'none'

* `cluster_id`
    Kubernetes cluster name (id).

    *type:* string

    *required:* true

* `additional_settings`
    Additional setting for instance group

    *default:* {}

* `use_external_resource`
    Indicate whether the resource exists or if {{< param product_name >}} should create the resource,
    true if you are bringing an existing resource, false if you want {{< param product_name >}} to create it.

    *type:* boolean

    *default:* false

* `resource_id`
    The GCP resource ID of the external resource, if
    use_external_resource is true. Otherwise it is an empty string.      

   *type:* string

   *default:* ''


## **cloudify.gcp.nodes.KubernetesClusterNetworkPolicy**
This node type refers to a GKE cluster network policy.

**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

**Properties:**

* `gcp_config`
    A dictionary of values to pass to authenticate with the Google Cloud Platform API.

    *default:* {}

* `network_policy_config`
    Configuration options for the NetworkPolicy feature.

    *required:* true

 * `cluster_id:`
    Kubernetes cluster name (id)

    *type:* string

    *required:* true

* `additional_settings`
    Additional setting for instance group

    *default:* {}

* `use_external_resource`
    Indicate whether the resource exists or if {{< param product_name >}} should create the resource,
    true if you are bringing an existing resource, false if you want {{< param product_name >}} to create it.

    *type:* boolean

    *default:* false

* `resource_id`
    The GCP resource ID of the external resource, if
    use_external_resource is true. Otherwise it is an empty string.      

    *type:* string

    *default:* ''  

# Relationships

## cloudify.gcp.relationships.contained_in_compute
**Derived From:** cloudify.relationships.contained_in


## cloudify.gcp.relationships.contained_in_network
**Derived From:** cloudify.relationships.contained_in


## cloudify.gcp.relationships.dns_record_connected_to_instance
**Derived From:** cloudify.relationships.connected_to


## cloudify.gcp.relationships.dns_record_connected_to_ip
**Derived From:** cloudify.relationships.connected_to


## cloudify.gcp.relationships.dns_record_contained_in_zone
**Derived From:** cloudify.relationships.contained_in


## cloudify.gcp.relationships.file_system_contained_in_compute
**Derived From:** cloudify.relationships.contained_in


## cloudify.gcp.relationships.forwarding_rule_connected_to_target_proxy
**Derived From:** cloudify.relationships.connected_to


## cloudify.gcp.relationships.instance_connected_to_disk
**Derived From:** cloudify.relationships.connected_to


## cloudify.gcp.relationships.instance_connected_to_instance_group
**Derived From:** cloudify.relationships.connected_to


## cloudify.gcp.relationships.instance_connected_to_ip
**Derived From:** cloudify.relationships.connected_to


## cloudify.gcp.relationships.instance_connected_to_keypair
**Derived From:** cloudify.relationships.connected_to


## cloudify.gcp.relationships.instance_connected_to_security_group
**Derived From:** cloudify.relationships.connected_to


## cloudify.gcp.relationships.instance_contained_in_network
**Derived From:** cloudify.relationships.contained_in


## cloudify.gcp.relationships.uses_as_backend
**Derived From:** cloudify.relationships.connected_to




# Account Information

The plugin needs access to your GCP auth credentials (via the [`gcp_config`](#common-properties) parameter) in order to operate (but see below about use within a manager).


## `gcp_config`
If you don't want to provide the `gcp_config` dictionary to every node in your blueprints, you can provide it, as `json`, at `/etc/cloudify/gcp_plugin/gcp_config`


## Networks

Instances in GCP are not able to communicate internally with instances in a different network.
This means that if you want to run {{< param product_name >}} agents on your nodes they must be in the same network as the manager.

Additionally, a given network must choose either auto-subnets or manual subnets operation when created.
For maximum flexibility, `auto_subnets: false` is recommended, though this requires that subnets are created for any region you wish to place Instances in.
