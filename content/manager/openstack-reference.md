---
layout: bt_wiki
title: Openstack Bootstrap
category: Manager Intro
draft: false
weight: 310
---

## Environment Specific Inputs

- Credentials and identification in order to connect to openstack
    - keystone_username
    - keystone_password
    - keystone_tenant_name
    - keystone_url
    - region

- nova_url: Use this in order to override the default nova URL provided by the `keystone_url`
- neutron_url: Use this in order to override the default neutron URL provided by the `keystone_url`
- external_network_name: Name of the external openstack network

- Names of the openstack components (have default values):
    - manager_server_name
    - management_network_name
    - management_subnet_name
    - management_router
    - manager_security_group_name
    - agents_security_group_name
    - manager_port_name

## Provisioned Resources

- Cloudify Manager vm
- Management network
- Management subnet
- Management router
- Two security groups
- Two key pairs
- The following ports will be opened on the Cloudify Manager:
    - 80
    - 443
    - 22
    - 8101 (rest service)
    - 5672 (AMQP)
    - 53229 (file server)

{{% gsNote title="Note" %}}
Ports 8101, 5672 and 53229 will only be opened for connections within the management subnet.
{{% /gsNote %}}