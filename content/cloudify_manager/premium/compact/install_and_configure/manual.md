+++
title = "Manual Install"
description = "This guide describes the process of configuring and installing such a cluster."
weight = 20
alwaysopen = false
+++


## Overview

{{% note %}}
Before you start the manual process of installing a {{< param product_name >}} cluster, you might want to consider
using the [Cluster Manager package]({{< relref "cloudify_manager/premium/compact/install_and_configure/cluster_manager.md" >}}) that automates it.
{{% /note %}}


This guide describes the process of configuring and installing such a cluster:

1. [Preparation and Certificates Setup](#preparation-and-certificates-setup)
1. [Installing Services](#installing-services)
1. [Day 2 Commands](#day-2-commands)

## Preparation and Certificates Setup {#preparation-and-certificates-setup}

### Preparing the Environment

1. Ensure you have three VMs with cfy_manager available on each:
    * Please follow the [prerequisites and sizing guidelines]({{< relref "cloudify_manager/premium/compact/requirments/capacity_and_planning.md" >}})
      to configure each VM.
    * In order to install the cfy_manager CLI:
        1. [Download]({{< ref "trial_getting_started/set_trial_manager/other-deployments.md#premium-downloads" >}}) the {{< param cfy_manager_name >}} Install RPM.
        1. Install the downloaded RPM by running:
           ```
           sudo yum install -y <RPM file path>
           ```

1. All VMs should be on the same network and if there is firewall/ security group.
   Make sure the used ports are open and not blocking any of our services.

1. Each VM must have a license file on it.

1. You should also prepare a load balancer to distribute the load over the managers.

### Certificates Setup
Please refer to the [Cluster certificates setup guide]({{< ref "cloudify_manager/architecture/security/certificates_overview.md#cluster-certificates-setup" >}}).
Each VM should have its own certificates and CA certificate on it.

## Installing Services {#installing-services}

#### Important Notes:

1. All passwords given are for example purposes only and **shouldn’t be used in production**.

1. All placeholders that should be filled-in are indicated by angle brackets, e.g. `<fill this in>`.
   Before you run any install commands make sure you haven’t got any angle brackets left in the files.

1. All hostnames used should be just the hostname, not including the domain.  
   **NOTE**: If you wish to use FQDNs instead, then you will need to alter the RabbitMQ config
   and add `use_long_name: true` in the `rabbitmq` section. Caution: Setting this, will require
   manually specifying the target node and using the `--longnames` argument for any `rabbitmqctl` operations.


### Installing PostgreSQL DB Services

On each node, create the file /etc/cloudify/db_config.yaml, containing:

```yaml
manager:
  private_ip: <this node IP address>
  public_ip: <this node IP address>

postgresql_server:
  postgres_password: 'areallystrongandsecretpasswordforpostgres'

  cert_path: '<this node local certificate path>'
  key_path: '<this node local private key path>'
  ca_path: '<local CA certificate path>'

  cluster:
    nodes:
      <node-1 hostname>:
        ip: <node-1 IP address>
      <node-2 hostname>:
        ip: <node-2 IP address>
      <node-3 hostname>:
        ip: <node-3 IP address>

    etcd:
      cluster_token: 'astrongandsecretpasswordlikestring'
      root_password: 'anotherstrongandsecretbutdifferentpassword'
      patroni_password: 'yetanotherstrongandsecretpassword'

    patroni:
      rest_user: patroni
      rest_password: 'strongandsecretpatronirestpassword'

    postgres:
      replicator_password: 'stillanotherstrongandsecretpassword'

prometheus:
  credentials:
    username: 'monitoringusername'
    password: 'longyeteasytorememberstringasapassword'

  cert_path: '<this node local certificate path>'
  key_path: '<this node local private key path>'
  ca_path: '<local CA certificate path>'

services_to_install:
  - database_service
  - monitoring_service
```

Then, run:
```
cfy_manager install -c /etc/cloudify/db_config.yaml --verbose
```

After PostgreSQL service is installed on all three nodes, verify that everything
looks healthy with running on one of them: 
```
cfy_manager dbs list -c /etc/cloudify/db_config.yaml
```


### Installing RabbitMQ Services

On each node, create the file /etc/cloudify/rabbitmq_config.yaml, containing:

```yaml
manager:
  private_ip: <this node IP address>
  public_ip: <this node IP address>

rabbitmq:
  username: cloudify
  password: areallystrongandsecretpasswordforrabbit

  cert_path: '<this node local certificate path>'
  key_path: '<this node local private key path>'
  ca_path: '<local CA certificate path>'

  cluster_members:
    <node-1 hostname>:
      networks:
        default: <node-1 IP address>
        load_balancer: <the load-balancer IP address>
    <node-2 hostname>:
      networks:
        default: <node-2 IP address>
        load_balancer: <the load-balancer IP address>
    <node-3 hostname>:
      networks:
        default: <node-3 IP address>
        load_balancer: <the load-balancer IP address>

  nodename: <this node hostname>

  join_cluster: <node-1 hostname; **should be left blank on node-1**>

  erlang_cookie: anothersecurepasswordlikestring

prometheus:
  credentials:
    username: 'monitoringusername'
    password: 'longyeteasytorememberstringasapassword'

  cert_path: '<this node local certificate path>'
  key_path: '<this node local private key path>'
  ca_path: '<local CA certificate path>'

services_to_install:
  - queue_service
  - monitoring_service
```

Then, run:
```
cfy_manager install -c /etc/cloudify/rabbitmq_config.yaml --verbose
```

After RabbitMQ service is installed on all three nodes, verify that everything
looks healthy with running on one of them: 
```
cfy_manager brokers list -c /etc/cloudify/rabbitmq_config.yaml
```


### Installing {{< param product_name >}} Management Services

On each node, create the file /etc/cloudify/manager_config.yaml, containing:

```yaml
manager:
  private_ip: <this node IP address>
  public_ip: <this node IP address>
  security:
    ssl_enabled: true
    admin_password: strongsecretadminpassword
  cloudify_license_path: <local license path>

postgresql_server:
  ca_path: '<local CA certificate path>'

  cluster:
    nodes:
      <node-1 hostname>:
        ip: <node-1 IP address>
      <node-2 hostname>:
        ip: <node-2 IP address>
      <node-3 hostname>:
        ip: <node-3 IP address>

postgresql_client:
  server_password: 'areallystrongandsecretpasswordforpostgres'
  ssl_enabled: true

networks:
  default: <this node IP address>
  load_balancer: <the load-balancer IP address>

rabbitmq:
  username: cloudify
  password: areallystrongandsecretpasswordforrabbit

  ca_path: '<local CA certificate path>'

  cluster_members:
    <node-1 hostname>:
      networks:
        default: <node-1 IP address>
        load_balancer: <the load-balancer IP address>
    <node-2 hostname>:
      networks:
        default: <node-2 IP address>
        load_balancer: <the load-balancer IP address>
    <node-3 hostname>:
      networks:
        default: <node-3 IP address>
        load_balancer: <the load-balancer IP address>

ssl_inputs:
  external_cert_path: '<this node local certificate path>'
  external_key_path: '<this node local private key path>'
  internal_cert_path: '<this node local certificate path>'
  internal_key_path: '<this node local private key path>'
  ca_cert_path: '<local CA certificate path>'
  external_ca_cert_path: '<local CA certificate path>'

prometheus:
  credentials:
    username: 'monitoringusername'
    password: 'longyeteasytorememberstringasapassword'

  cert_path: '<this node local certificate path>'
  key_path: '<this node local private key path>'
  ca_path: '<local CA certificate path>'

services_to_install:
  - manager_service
  - monitoring_service
  - entropy_service
```

Then, run:
```
cfy_manager install -c /etc/cloudify/manager_config.yaml --verbose
```

After {{< param product_name >}} Management service is installed on all three nodes, verify that the cluster
looks healthy with running on one of them: 
```
cfy cluster status
```

## Day 2 Commands {#day-2-commands}
Running day 2 (post installation) `cfy_manager` commands will require specifying the appropriate config.yaml file using the `-c` flag.
For example:

* Listing the DB cluster members: 
  ```
  cfy_manager dbs list -c /etc/cloudify/db_config.yaml
  ```
* Listing the RabbitMQ cluster members: 
  ```
  cfy_manager brokers list -c etc/cloudify/rabbitmq_config.yaml
  ```
