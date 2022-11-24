+++
title = "Manual Install"
description = "This guide describes the process of configuring and installing such a cluster."
weight = 20
alwaysopen = false
+++

## Overview
**Note:** Make sure that your environment meets the [prerequisites]({{< relref "cloudify_manager/premium/fully_distributed/requirments/capacity_and_planning.md" >}})
before you install {{< param cfy_manager_name >}}, you have read the [installation and configuration guide]({{< relref "cloudify_manager/premium/aio/install_and_configure/centos_rhel.md" >}}), and deployed the manager's RPM.

{{% note %}}  
Before you start the manual process of installing a {{< param product_name >}} cluster, you might want to consider
using the [Cluster Manager package] ({{< relref "cloudify_manager/premium/fully_distributed/install_and_configure/cluster_manager.md" >}}) that automates it.
{{% /note %}}  


This guide describes the process of configuring and installing such a cluster:

1. [Certificates Setup](#certificates-setup")
1. [Installing Services](#installing-services)
1. [Post Installation](#post-installation)

{{% note title="Externally hosted PostgreSQL and RabbitMQ" %}}  
In case you use an externally hosted PostgreSQL or RabbitMQ, i.e. "bring your own", please make sure you go over all sections and
read the relevant information for this case.
{{% /note %}}  

**Note:** Before you proceed, make sure that all the required VMs are spinning, that they are all allocated with a public IP, and that they are configured according
to the [prerequisites guide]({{< relref "cloudify_manager/premium/fully_distributed/requirments/capacity_and_planning.md" >}}).
If you use {{< param product_name >}}'s best practices, you will need 9 VMs plus a load balancer. The VMs partitioning is 3 PostgreSQL nodes, 3 RabbitMQ nodes, and 3 {{< param cfy_manager_name >}} service nodes.


## Certificates Setup {#certificates-setup}
Please refer to the [Cluster certificates setup guide]({{< relref "cloudify_manager/architecture/security/certificates_overview.md#cluster-certificates-setup" >}}).

## Installing Services {#installing-services}
The {{< param product_name >}} Manager cluster best practices consist of three main services: PostgreSQL Database, RabbitMQ, and a {{< param product_name >}} Management Service.
Each of these services is a cluster comprised of three nodes and each node should be installed separately by order.
Another optional service of the {{< param cfy_manager_name >}} cluster is the Management Service Load Balancer, which should be installed after all the other components.  
The following sections describe how to install and configure {{< param cfy_manager_name >}} cluster services. The order of installation should be as follows:

1. [PostgresSQL Database Cluster](#postgresql-database-cluster")
2. [RabbitMQ Cluster](#rabbitmq-cluster)
3. [{{< param product_name >}} Management Service](#cloudify-management-service")
4. [Management Service Load Balancer](#management-service-load-balancer)

### Preparation
1. Ensure you have 9 VMs with cfy_manager available on each
   ```
   sudo yum install <Cloudify RPM>
   ```
1. All VMs should be on the same network and if there is a firewall/ security group, make sure used ports are open and not blocking any of our services.
See the [prerequisites page]({{< relref "cloudify_manager/premium/fully_distributed/requirments/capacity_and_planning.md" >}}) to see which ports are used by PostgresSQL, RabbitMQ, and manager.
1. For each instance, copy the {{< param product_name >}} license to the host.   
1. Copy the `/home/centos/.cloudify-test-ca` directory from the VM where you generated the certificates to the same location on the other VMs.

{{% note %}}  
The fact that all of the certificates in our example reside in `.cloudify-test-ca` directory is because the reason we generated test certificates with `cfy_manager generate-test-cert` command.
Generally, each instance needs only its certificates, and not all instances' certificates, and certificates' location can be different (just need to specify them in the node config.yaml).
{{% /note %}}  

(In this examples home directory is `/home/centos`)

### PostgreSQL Database Cluster {#postgresql-database-cluster}

The PostgreSQL database high-availability cluster is comprised of 3 nodes ({{< param product_name >}} best-practice) or more.

**Note:** Make sure the following ports are open for each node:

 Port      | Description
-----------|------------
 tcp/2379  | etcd port
 tcp/2380  | etcd port
 tcp/5432  | PostgreSQL connection port
 tcp/8008  | Patroni control port
 tcp/8009  | Monitoring service port


#### Locally Hosted PostgreSQL Database Cluster Installation

Configure the following settings in `/etc/cloudify/config.yaml` for each PostgreSQL node:
```yaml
manager:
  private_ip: <ip of this host>
  public_ip: <ip of this host>

postgresql_server:

    postgres_password: '<strong password for postgres superuser>'

    cert_path: '<path to certificate for this server>'
    key_path: '<path to key for this server>'
    ca_path: '<path to ca certificate>'

    cluster:
        nodes:
            <first postgresql instance-name>:
                ip: <private ip of postgres server 1>
            <second postgresql instance-name>:
                ip: <private ip of postgres server 2>
            <third postgresql instance-name>:
                ip: <private ip of postgres server 3>

        # Should be the same on all nodes
        etcd:
            cluster_token: '<a strong secret string (password-like)>'
            root_password: '<strong password for etcd root user>'
            patroni_password: '<strong password for patroni to interface with etcd>'

        # Should be the same on all nodes
        patroni:
            rest_password: '<strong password for replication user>'

        # Should be the same on all nodes
        postgres:
            replicator_password: '<strong password for replication user>'


# For monitoring service(status reporter)
prometheus:
  credentials:
    username: <monitoring username>
    password: <strong password for monitoring user>

  cert_path: <certificate for prometheus, cert_path of this postgresql_server can be used>
  key_path: <key for promethus, key_path of postgresql_server can be used>
  ca_path: <ca for promethus, ca_path of postgresql_server can be used>
  postgres_exporter:
    # `password` is a placeholder and will be updated during config file rendering, based on postgresql_server.postgres_password
    password: ''
    sslmode: require

services_to_install:
    - database_service
    - monitoring_service
```

Execute on each node **sequentially** (i.e. do not start installing next instance unless the previous has been successfully installed):
```bash
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
```

After installing all nodes, choose one node to verify that everything looks healthy with: 
```
cfy_manager dbs list
```

Example:
```yaml
manager:
  private_ip: <ip of this host>
  public_ip: <ip of this host>

postgresql_server:
  postgres_password: 'areallystrongandsecretpasswordforpostgres'

  cert_path: '/home/centos/.cloudify-test-ca/<ip of this host>.crt'
  key_path: '/home/centos/.cloudify-test-ca/<ip of this host>.key'
  ca_path: '/home/centos/.cloudify-test-ca/ca.crt'

  cluster:
    nodes:
      <first postgresql instance-name>:
        ip: <private ip of postgres server 1>
      <second postgresql instance-name>:
        ip: <private ip of postgres server 2>
      <third postgresql instance-name>:
        ip: <private ip of postgres server 3>

    etcd:
      cluster_token: 'astrongandsecretpasswordlikestring'
      root_password: 'anotherstrongandsecretbutdifferentpassword'
      patroni_password: 'yetanotherstrongandsecretpassword'

    patroni:
      rest_user: patroni
      rest_password: 'strongandsecretpatronirestpassword'

    postgres:
      replicator_password: 'stillanotherstrongandsecretpassword'

# For monitoring service(status reporter)
prometheus:
  credentials:
    username: 'monitoringusername'
    password: 'longyeteasytorememberstringasapassword'

  cert_path: '/home/centos/.cloudify-test-ca/<ip of this host>.crt'
  key_path: '/home/centos/.cloudify-test-ca/<ip of this host>.key'
  ca_path: '/home/centos/.cloudify-test-ca/ca.crt'
  postgres_exporter:
    # `password` is a placeholder and will be updated during config file rendering, based on postgresql_server.postgres_password
    password: ''
    sslmode: require

services_to_install:
  - database_service
  - monitoring_service

```

#### Externally Hosted PostgreSQL Database Installation
{{< param product_name >}} supports [Microsoft's Azure Database for Postgres](https://docs.microsoft.com/en-us/azure/postgresql/) as an external database option replacing {{< param product_name >}}'s PostgreSQL deployment.
When using Azure Database for Postgres see the [external database installation guide]({{< relref "cloudify_manager/premium/fully_distributed/install_and_configure/external_db_and_mq.md#externally-hosted-postgresql-database-installation" >}}).


### RabbitMQ Cluster {#rabbitmq-cluster}

The RabbitMQ service is a cluster comprised of any amount of nodes,
whereas {{< param product_name >}}'s' best practice is 3 nodes.

**Note:** Please refer to the [RabbitMQ networking guide - Ports](https://www.rabbitmq.com/networking.html#ports)
to verify the open ports needed for a RabbitMQ cluster installation.  Also,
access the monitoring service.


#### Locally Hosted RabbitMQ Cluster Installation  

Configure and install the first RabbitMQ node and then the rest of the nodes.

For the first RabbitMQ node, configure the following settings in `/etc/cloudify/config.yaml`:

```yaml
manager:
  private_ip: <ip of this host>
  public_ip: <ip of this host>

rabbitmq:

  username: '<secure username for queue management>'
  password: '<secure password for queue management>'

  cluster_members:
    <host name of rabbit server 1>:
      networks:
        default: <private ip of rabbit server 1>
    <host name of rabbit server 2>:
        networks:
            default: <private ip of rabbit server 2>
    <host name of rabbit server 3>:
        networks:
            default: <private ip of rabbit server 3>

  cert_path: '<path to certificate for this server>'
  key_path: '<path to key for this server>'
  ca_path: '<path to ca certificate>'

  nodename: '<short host name of this rabbit server>'

  # Should be the same on all nodes
  erlang_cookie: '<a strong secret string (password-like)>'

# For monitoring service(status reporter)
prometheus:
  credentials:
    username: <monitoring username>
    password: <strong password for monitoring user>

  cert_path: <certificate for prometheus, cert_path of this rabbitmq can be used>
  key_path: <key for promethus, key_path of rabbitmq can be used>
  ca_path: <ca for promethus, key_path of rabbitmq can be used>'
services_to_install:
  - queue_service
  - monitoring_service
```

For the rest of RabbitMQ nodes, just add join_cluster in the RabbitMQ section, as in the following config.yaml:

```yaml
manager:
  private_ip: <ip of this host>
  public_ip: <ip of this host>

rabbitmq:

  username: '<secure username for queue management>'
  password: '<secure password for queue management>'

  cluster_members:
    <host name of rabbit server 1>:
      networks:
        default: <private ip of rabbit server 1>
    <host name of rabbit server 2>:
        networks:
            default: <private ip of rabbit server 2>
    <host name of rabbit server 3>:
        networks:
            default: <private ip of rabbit server 3>

  cert_path: '<path to certificate for this server>'
  key_path: '<path to key for this server>'
  ca_path: '<path to ca certificate>'

  nodename: '<short host name of this rabbit server>'

  # Should be the same on all nodes
  erlang_cookie: '<a strong secret string (password-like)>'
  join_cluster: '<hostname of first rabbit server>'

# For monitoring service(status reporter)
prometheus:
  credentials:
    username: <monitoring username>
    password: <strong password for monitoring user>

  cert_path: <certificate for prometheus, cert_path of this rabbitmq can be used>
  key_path: <key for promethus, key_path of rabbitmq can be used>
  ca_path: <ca for promethus, key_path of rabbitmq can be used>'
services_to_install:
  - queue_service
  - monitoring_service
```

Execute on each node **sequentially** (i.e. do not start installing next manager unless the previous has been successfully installed):

```bash
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
```

After installing all nodes, choose one node to verify that everything looks healthy with: 
```
cfy_manager brokers list
```

Example:

```yaml
manager:
  private_ip: <ip of this host>
  public_ip: <ip of this host>

rabbitmq:
  username: cloudify
  password: areallystrongandsecretpasswordforrabbit

  cert_path: '/home/centos/.cloudify-test-ca/<ip of this host>.crt'
  key_path: '/home/centos/.cloudify-test-ca/<ip of this host>.key'
  ca_path: '/home/centos/.cloudify-test-ca/ca.crt'

  cluster_members:
    <host name of rabbit server 1>:
      networks:
        default: <private ip of rabbit server 1>
    <host name of rabbit server 2>:
        networks:
            default: <private ip of rabbit server 2>
    <host name of rabbit server 3>:
        networks:
            default: <private ip of rabbit server 3>

  nodename: 'my_rabbitmq_host_2'

  join_cluster: 'my_rabbitmq_host_1'

  erlang_cookie: anothersecurepasswordlikestring

# For monitoring service(status reporter)
prometheus:
  credentials:
    username: 'monitoringusername'
    password: 'longyeteasytorememberstringasapassword'

  cert_path: '/home/centos/.cloudify-test-ca/<ip of this host>.crt'
  key_path: '/home/centos/.cloudify-test-ca/<ip of this host>.key'
  ca_path: '/home/centos/.cloudify-test-ca/ca.crt'

services_to_install:
  - queue_service
  - monitoring_service
```

#### Externally Hosted RabbitMQ Installation
In order to install externally hosted RabbitMQ see the [external database installation guide]({{< relref "cloudify_manager/premium/fully_distributed/install_and_configure/external_db_and_mq.md#externally-hosted-rabbitmq-installation" >}}).

### {{< param product_name >}} Management Service {#cloudify-management-service}

The {{< param product_name >}} Management service is a cluster comprised of 2 to 10 nodes,
whereas {{< param product_name >}}'s' best practice is 3 nodes.

* Make sure the following ports are open for each node:

 Port      | Description
-----------|------------
 tcp/80    | REST API and UI. For improved security we recommend using secure communication (SSL), if your system is configured for SSL, this port should be closed.
 tcp/443   | REST API and UI.
 tcp/22    | For remote access to the manager from the {{< param cfy_cli_name >}}.
 tcp/5671  | RabbitMQ. This port must be accessible from agent VMs.
 tcp/53333 | Internal REST communications. This port must be accessible from agent VMs.
 tcp/5432  | PostgreSQL connection port.
 tcp/8008  | Patroni control port.
 tcp/8009  | Monitoring service port.
 tcp/22000 | Filesystem replication port.


* **Please notice the 'networks' section** in the config.yaml file. In the case you use a load balancer, you will need to specify its private IP in order for the different agents to connect to it.
Please see further explanation in the "Accessing the Load Balancer Using {{< param cfy_agent_name >}}s" section of this guide under
"Management Service Load Balancer".

Configure the following settings in `/etc/cloudify/config.yaml` for each manager service cluster node:

**Note:** In case you want to use an externally hosted PostgreSQL database and an internally hosted RabbitMQ or vice versa,
please use the relevant section from the following examples and use in your configuration.

* In case of an **internally hosted PostgreSQL database** and an **internally hosted RabbitMQ**:

```yaml
manager:
  private_ip: <ip of this host>
  public_ip: <ip of this host>
  security:
    ssl_enabled: true
    admin_password: '<strong admin password for {{< param product_name >}}>'

  cloudify_license_path: '<path to {{< param product_name >}} license file>'

  monitoring:
    username: <monitoring username>
    password: <strong password for monitoring user>

rabbitmq:
  username: '<username you configured for queue management on rabbit, needs to be the same as in the RabbitMQ nodes config.yaml>'
  password: '<strong password you configured for queue management on rabbit>'
  ca_path: '<path to ca certificate>'
  cluster_members:
    <host name of rabbit server 1>:
      networks:
        default: <private ip of rabbit server 1>
    <host name of rabbit server 2>:
        networks:
            default: <private ip of rabbit server 2>
    <host name of rabbit server 3>:
        networks:
            default: <private ip of rabbit server 3>
  monitoring:
    username: <monitoring username>
    password: <strong password for monitoring user>


postgresql_server:
  ca_path: <path to rabbitmq ca certificate>
  postgres_password: <the postgresql server password>
  cluster:
    nodes:
      <first postgresql instance-name>:
        ip: <private ip of postgres server 1>
      <second postgresql instance-name>:
        ip: <private ip of postgres server 2>
      <third postgresql instance-name>:
        ip: <private ip of postgres server 3>


postgresql_client:
  ssl_enabled: true

  # Same password as the one of the PostgreSQL server.
  # THE PASSWORD WILL BE REMOVED FROM THE FILE AFTER THE INSTALLATION FINISHES
  server_password: '<the postgresql server password>'

  # If true, client SSL certificates will need to be supplied for database connections
  ssl_client_verification: true

  monitoring:
    username: <monitoring username>
    password: <strong password for monitoring user>


# In case you use a load-balancer, you would need to specify its private IP
# in order for the different agents to connect to it.
networks:
    load-balancer: <load-balancer private IP address>

ssl_inputs:
  internal_cert_path: '<path to this host certificate generated in the first step>'
  internal_key_path: '<path to this host key generated in the first step>'
  external_cert_path: '<can be same as internal_cert_path(for CLI)>'
  external_key_path: '<can be same as internal_key_path(for CLI)>'
  ca_cert_path: '<path to this host ca certificate>'
  external_ca_cert_path: '<path to external ca certificate for this server, can be the same one as ca_cert_path>'
  postgresql_client_cert_path: '<path to cert for this server>'
  postgresql_client_key_path: '<path to key for this server>'

# For monitoring service(status reporter)
prometheus:
  blackbox_exporter:
    ca_cert_path: <ca path for blackbox exporter>
  credentials:
    username: <monitoring username>
    password: <strong password for monitoring user>

  cert_path: <certificate for prometheus, cert_path of this host can be used>
  key_path: <key for promethus, key_path this host can be used>
  ca_path: <ca for promethus, ca_path this host can be used>'

services_to_install:
    - manager_service
    - monitoring_service

```

Execute on each node **sequentially** (i.e. do not start installing next manager unless the previous has been successfully installed):
```bash
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
```

Example:
```yaml
manager:
  private_ip: <ip of this host>
  public_ip: <ip of this host>
  security:
    ssl_enabled: true
    admin_password: strongsecretadminpassword

  cloudify_license_path: /home/centos/license.yaml

  monitoring:
    username: monitoringusername
    password: longyeteasytorememberstringasapassword

rabbitmq:
  username: cloudify
  password: areallystrongandsecretpasswordforrabbit
  ca_path: '/home/centos/.cloudify-test-ca/ca.crt'
  cluster_members:
    <host name of rabbit server 1>:
      networks:
        default: <private ip of rabbit server 1>
    <host name of rabbit server 2>:
        networks:
            default: <private ip of rabbit server 2>
    <host name of rabbit server 3>:
        networks:
            default: <private ip of rabbit server 3>
  monitoring:
    username: monitoringusername
    password: longyeteasytorememberstringasapassword


postgresql_server:
  ca_path: '/home/centos/.cloudify-test-ca/ca.crt'
  postgres_password: areallystrongandsecretpasswordforpostgres
  cluster:
    nodes:
      <first postgresql instance-name>:
        ip: <private ip of postgres server 1>
      <second postgresql instance-name>:
        ip: <private ip of postgres server 2>
      <third postgresql instance-name>:
        ip: <private ip of postgres server 3>


postgresql_client:
  ssl_enabled: true

  # Same password as the one of the PostgreSQL server.
  # THE PASSWORD WILL BE REMOVED FROM THE FILE AFTER THE INSTALLATION FINISHES
  server_password: 'areallystrongandsecretpasswordforpostgres'

  # If true, client SSL certificates will need to be supplied for database connections
  ssl_client_verification: true

  monitoring:
    username: monitoringusername
    password: longyeteasytorememberstringasapassword

# In case you use a load-balancer, you would need to specify its private IP
# in order for the different agents to connect to it.
networks:
    load-balancer: <load-balancer private IP address>

ssl_inputs:
  internal_cert_path: '/home/centos/.cloudify-test-ca/<ip of this host>.crt'
  internal_key_path: '/home/centos/.cloudify-test-ca/<ip of this host>.key'
  external_cert_path: '/home/centos/.cloudify-test-ca/<ip of this host>.crt'
  external_key_path: '/home/centos/.cloudify-test-ca/<ip of this host>.key'
  ca_cert_path:  '/home/centos/.cloudify-test-ca/ca.crt'
  external_ca_cert_path: '/home/centos/.cloudify-test-ca/ca.crt'
  postgresql_client_cert_path: '/home/centos/.cloudify-test-ca/<ip of this host>.crt'
  postgresql_client_key_path: '/home/centos/.cloudify-test-ca/<ip of this host>.key'

# For monitoring service(status reporter)
prometheus:
  blackbox_exporter:
    ca_cert_path: '/home/centos/.cloudify-test-ca/ca.crt'
  credentials:
    username: 'monitoringusername'
    password: 'longyeteasytorememberstringasapassword'

  cert_path: '/home/centos/.cloudify-test-ca/<ip of this host>.crt'
  key_path: '/home/centos/.cloudify-test-ca/<ip of this host>.key'
  ca_path: '/home/centos/.cloudify-test-ca/ca.crt'

services_to_install:
    - manager_service
    - monitoring_service

```

### Management Service Load Balancer {#management-service-load-balancer}

The {{< param product_name >}} setup requires a load-balancer to direct the traffic across the {{< param product_name >}} Management service cluster nodes.
Any load balancer can be used provided that the following are supported:

1. The load balancer directs the traffic over the following ports to the manager nodes based on round robin or any other load-sharing policy:
   * Port 443 - REST API & UI.
   * Port 8009 - Monitoring Service to Manager communication and between the Monitoring Services.
   * Port 53333 - Agents to Manager communication.
   * **Note:** Port 80 is not mentioned and should not be load balanced because the recommended approach is to use SSL.
1. **Session stickiness** must be kept.

#### Accessing the Load Balancer Using {{< param cfy_agent_name >}}s

In case you use a load balancer and you want {{< param cfy_agent_name >}}s to communicate with it instead of a specific {{< param cfy_manager_name >}}
 node, you can use the following [Multi-Network Management guide]({{< ref "cloudify_manager/premium/aio/install_and_configure/centos_rhel.md#multi-network-management" >}})
and specify the load balancer private IP as the value of the 'external' key under 'networks'. Moreover, in case you want all communication of the {{< param cfy_agent_name >}}s
to go through the load balancer, you can specify its private IP as the value of the 'default' key under 'networks' (as shown in the config.yaml above).

#### Installing a Load Balancer

**Note:** Although the load balancer is not provided by {{< param product_name >}}, here is a simple example of HAProxy as a load balancer.

In order to use HAProxy as a load balancer, you would first need to download HAProxy to your machine and set the relevant certificates.

Afterward, you will need to configure HAProxy as the {{< param cfy_manager_name >}}s' load balancer, and you can do so using the following configuration:

```cfg
global
    maxconn 100
    tune.ssl.default-dh-param 2048
defaults
    log global
    retries 2
    timeout client 30m
    timeout connect 4s
    timeout server 30m
    timeout check 5s
listen manager
    bind *:80
    bind *:443 ssl crt /etc/haproxy/cert.pem
    redirect scheme https if !{ ssl_fc }
    mode http
    option forwardfor
    stick-table type ip size 1m expire 1h
    stick on src
    option httpchk GET /api/v3.1/status
    http-check expect status 401
    default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions
    server manager_<first manager private-ip> <first manager public-ip> maxconn 100 ssl check check-ssl port 443 ca-file /etc/haproxy/ca.crt
    server manager_<second manager private-ip> <second manager public-ip> maxconn 100 ssl check check-ssl port 443 ca-file /etc/haproxy/ca.crt
    server manager_<third manager private-ip> <third manager public-ip> maxconn 100 ssl check check-ssl port 443 ca-file /etc/haproxy/ca.crt
```

## Post Installation {#post-installation}

### Update the CLI

Update all remote CLI instances (not hosted on the manager) to the newly deployed {{< param product_name >}} version. Please refer to the [CLI installation guide]({{< relref "cloudify_manager/cloudify_cli" >}}) for further instructions.

Run the following command from the client in order to connect to the load balancer:
```bash
cfy profiles use <load-balancer host ip> -u <username> -p <password> -t <tenant-name>
```

In case you haven't mentioned the license path in the config.yaml file of the Manager installation, you can
upload a valid {{< param product_name >}} license from the client using the following command:
```bash
cfy license upload <path to the license file>
```

### Day 2 Cluster Operations
Please refer to the [Day 2 cluster operations guide]({{< relref "cloudify_manager/premium/fully_distributed/operations.md" >}}) for further operations regarding the {{< param product_name >}} active-active cluster.
