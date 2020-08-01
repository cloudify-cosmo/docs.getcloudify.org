---
layout: bt_wiki
title: Installing and Configuring a Cloudify Manager Distributed Cluster
description: Install a Cloudify Manager Cluster environment to ensure High Availability. 
category: Installation
draft: false
weight: 4
aliases:
  - /installation/installation-overview/
  - /installation/bootstrapping/
  - /installation/from-packages/
  - /installation/installing-manager/
---


{{% note title="Prerequisites" %}}
Make sure that your environment meets the [prerequisites]({{< relref "install_maintain/installation/prerequisites.md" >}}) 
before you install Cloudify Manager and that you have read the [installation and configuration guide]({{< relref "install_maintain/installation/installing-manager.md" >}}) and deployed the manager's RPM.
{{% /note %}}

# Cloudify Cluster Architecture

![Cloudify_Cluster]( /images/cluster/cluster-architecture.png )

Cloudify Manager 5.1 introduces a new cluster architecture to Cloudify. This cluster is comprised of 3 separate services that construct the entire Cloudify solution:  

1. Cloudify Management service – The Management service embeds the Cloudify workers framework, the REST API, 
the User Interface infrastructure and other backend services.
The Cloudify Management service is a cluster of at least two Manager nodes running in an active/active mode.
1. PostgreSQL database cluster – This service provides a high-availability PostgreSQL cluster based on [Patroni](https://patroni.readthedocs.io/en/latest/). The cluster must consist of at least 3 nodes.
1. RabbitMQ cluster – This service provides a high-availability RabbitMQ cluster based on the RabbitMQ best practices. 
The cluster must consist of 3 nodes.

* An optional service is the load-balancer that is used to distribute the load between the different manager nodes.

This guide describes the process of configuring and installing such a cluster:

1. [Certificates Setup] ({{< relref "install_maintain/installation/installing-cluster.md#certificates-setup" >}})
1. [Installing Services] ({{< relref "install_maintain/installation/installing-cluster.md#installing-services" >}})
1. [Post Installation] ({{< relref "install_maintain/installation/installing-cluster.md#post-installation" >}})

{{% note title="Externally hosted PostgreSQL and RabbitMQ" %}}  
In case you use an Externally hosted PostgreSQL or RabbitMQ, i.e. "bring your own", please make sure you go over all sections and 
read the relevant information for this case. 
{{% /note %}}  

{{% note title="VMs setup" %}}  
Before you proceed, make sure you have all VMs spinning, that they are all allocated with a public-ip, and that they are configured according
to the [prerequisites guide] ({{< relref "install_maintain/installation/prerequisites.md" >}}).
If you use Cloudify best-practice, you would need 10 VMs spinning: 3 PostgreSQL nodes, 3 RabbitMQ nodes, 3 Cloudify Management service nodes, 
and 1 load-balancer instance.   
{{% /note %}}  


## Certificates Setup
The Cloudify Manager cluster uses the SSL protocol for:

1. Communication between the PostgreSQL cluster nodes.
1. Communication between the RabbitMQ cluster nodes.
1. Communication between the Cloudify Management service cluster nodes and the other services.

**Note:** Each time the term "CA" shows, it means the CA certificate of the CA that 
signed/issued the host's public certificate.  

{{% note title="Certificates" %}}  
* The certificates/keys should be created before proceeding with the installation process and in a PEM format.  
* The certificates/keys are copied to `/etc/cloudify/ssl` during installation from the source given by the user. 
Therefore, it is up to the user to delete the leftovers from the source location.  
* In case of using externally hosted PostgreSQL or RabbitMQ instances, the CA needs to be 
retrieved instead of created.
{{% /note %}}  

**Remark: All the following mentioned files should exist on the relevant instance**

For each PostgreSQL and RabbitMQ cluster node we will configure the following:

1. CA certificate path - The CA certificate should be the same for all cluster nodes. Meaning, 
the nodes' public certificates are signed by the same CA.
1. certificate (cert) path - A public certificate signed by the given CA that specifies the node's IP.
1. key path - The key associated with the certificate.

For each Cloudify Management service cluster node we will configure the following:

1. PostgreSQL nodes' CA path (CA is the same for all the cluster nodes). 
2. RabbitMQ nodes' CA path (CA is the same for all the cluster nodes). 

* We will also need to configure the following for each node:
  
   1. certificate (cert) path - A certificate signed by the given CA that specifies the node's IP("postgresql_client_cert_path" under ssl_inputs). 
   1. key path - The key associated with the certificate(postgresql_client_key_path under ssl_inputs). 


  
For creating example certificates , `cfy_manager generate-test-cert` command can be used:

On one VM, generate certificates for all VMs using:
```
cfy_manager generate-test-cert -s <manager 1 ip>,<manager 1 hostname>
cfy_manager generate-test-cert -s <manager 2 ip>,<manager 2 hostname>
cfy_manager generate-test-cert -s <manager 3 ip>,<manager 3 hostname>
cfy_manager generate-test-cert -s <postgres server 1 ip>,<postgres 1 hostname> 
..
..
cfy_manager generate-test-cert -s <rabbitmq server 3 ip>,<rabbitmq server 3 hostname> 
```  

**For production, please use proper CA (e.g. a company CA).**

On the examples in this page we use single CA.   
  
## Installing Services
The Cloudify Manager cluster best-practice consists of three main services: PostgreSQL Database, RabbitMQ, and a Cloudify Management Service. 
Each of these services is a cluster comprised of three nodes and each node should be installed separately by order. 
Another optional service of the Cloudify Manager cluster is the Management Service Load Balancer, which should be installed after all the other components.  
The following sections describe how to install and configure Cloudify Manager cluster services. The order of installation should be as follows:

1. [PostgresSQL Database Cluster ] ({{< relref "install_maintain/installation/installing-cluster.md#postgresql-database-cluster" >}})  
2. [RabbitMQ Cluster] ({{< relref "install_maintain/installation/installing-cluster.md#rabbitmq-cluster" >}})  
3. [Cloudify Management Service] ({{< relref "install_maintain/installation/installing-cluster.md#cloudify-management-service" >}}) 
4. [File Permissions]({{< relref "install_maintain/installation/installing-cluster.md/#file-permissions" >}})
5. [Management Service Load Balancer] ({{< relref "install_maintain/installation/installing-cluster.md#management-service-load-balancer" >}}) 

### Preperation
1. Ensure you have nine VMs with cfy_manager available on each. 
1. All VMs should be on the same network and there should be no firewall/security group blocking any of our services.
1. For each instance, please copy cloudify license to home directory.   
1. Copy the /home/centos/.cloudify-test-ca directory from the VM where you generated the certs to the same location on both the other VMs.
(On this examples home directory is /home/centos)

### PostgreSQL Database Cluster

The PostgreSQL database high-availability cluster is comprised of 3 nodes (Cloudify best-practice) or more.

**Note** Make sure the following ports are open for each node:

 Port      | Description
-----------|------------
 tcp/2379  | etcd port.
 tcp/2380  | etcd port.
 tcp/5432  | PostgreSQL connection port.
 tcp/8008  | Patroni control port.


#### Locally Hosted Cloudify PostgreSQL Database Cluster Installation

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
    password: <srtong password for monitoring user>

  cert_path: <certificate for prometheus, cert_path of postgresql_server can be used>
  key_path: <key for promethus, key_path of postgresql_server can be used>
  ca_path: <ca for promethus, key_path of postgresql_server can be used>
  postgres_exporter:
    # `password` is a placeholder and will be updated during config file rendering, based on postgresql_server.postgres_password
    password: ''
    sslmode: require

services_to_install:
    - database_service
    - monitoring_service
```

Execute on each node **sequentially** (i.e. do not start installing next manager unless the previous has been successfully installed):
```bash
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
``` 

On one node, verify that everything looks healthy with: `cfy_manager dbs list` .

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
Cloudify supports [Microsoft's Azure Database for Postgres](https://docs.microsoft.com/en-us/azure/postgresql/) as an external database option replacing Cloudify's PostgreSQL deployment. 
For using Azure Database for Postgres see [external database installation guide]({{< relref "install_maintain/installation/installing-external-db-and-queue-cluster.md#externally-hosted-postgresql-database-installation" >}}).


### RabbitMQ Cluster
  
The RabbitMQ service is a cluster comprised of any amount of nodes, 
whereas Cloudify best-practice is three nodes. 

**Note** Please refer to the [RabbitMQ networking guide - Ports](https://www.rabbitmq.com/networking.html#ports) 
to verify the open ports needed for a RabbitMQ cluster installation. 
  

#### Locally Hosted RabbitMQ Cluster Installation  
  
Configure and install the first RabbitMQ node and then the rest of the nodes.

For the first RabbitMQ, configure the following settings in `/etc/cloudify/config.yaml`:

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
    password: <srtong password for monitoring user>

  cert_path: <certificate for prometheus, cert_path of rabbitmq can be used>
  key_path: <key for promethus, key_path of rabbitmq can be used>
  ca_path: <ca for promethus, key_path of rabbitmq can be used>'
services_to_install:
  - queue_service
  - monitoring_service
```

For the rest of the nodes, configure the following settings in `/etc/cloudify/config.yaml`:


Add `join_cluster` section under `rabbitmq` section. 

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
  join_cluster: <hostname of first manager>

# For monitoring service(status reporter)
prometheus:
  credentials:
    username: <monitoring username>
    password: <srtong password for monitoring user>

  cert_path: <certificate for prometheus, cert_path of rabbitmq can be used>
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

On one node, verify that everything looks healthy with: `cfy_manager brokers list`

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
In order to install externally hosted RabbitMQ see [external database installation guide]({{< relref "install_maintain/installation/installing-external-db-and-queue-cluster.md#externally-hosted-rabbitmq-installation" >}}).

### Cloudify Management Service

The Cloudify Management service is a cluster comprised of two to ten nodes,
whereas Cloudify best-practice is three nodes.

* Make sure the following ports are open for each node:

 Port      | Description
-----------|------------
 tcp/80    | REST API and UI. For improved security we recommend using secure communication (SSL), if your system is configured for SSL, this port should be closed.
 tcp/443   | REST API and UI.
 tcp/22    | For remote access to the manager from the Cloudify CLI.
 tcp/5671  | RabbitMQ. This port must be accessible from agent VMs.
 tcp/53333 | Internal REST communications. This port must be accessible from agent VMs.
 tcp/5432  | PostgreSQL connection port.
 tcp/8008  | Patroni control port.
 tcp/22000 | Filesystem replication port.


* **Please notice the 'networks' section** in the config.yaml file. In case you use a load-balancer, you 
would need to specify its private IP in order for the different agents to connect to it. 
Please see further explanation in the "Accessing the Load Balancer Using Cloudify Agents" section of this guide under
"Management Service Load Balancer".

Configure the following settings in `/etc/cloudify/config.yaml` for each Manager service cluster node:

**Note:** In case you want to use an externally hosted PostgreSQL database and an internally hosted RabbitMQ or vice versa,
please use the relevant section from the following examples and use in your configuration.

* In case of an **internally hosted PostgreSQL database** and an **internally hosted RabbitMQ**:


```yaml
manager:
  private_ip: <ip of this host>
  public_ip: <ip of this host>
  security:
    ssl_enabled: true
    admin_password: '<strong admin password for cloudify>'
    
  cloudify_license_path: '<path to cloudify license file>'

  monitoring:
    username: <monitoring username>
    password: <srtong password for monitoring user>

rabbitmq:
  username: '<username you configured for queue management on rabbit>'
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
    password: <srtong password for monitoring user>


postgresql_server:
  ca_path: <path to ca certificate>
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
    password: <srtong password for monitoring user>


# In case you use a load-balancer, you would need to specify its private IP
# in order for the different agents to connect to it.
networks:
    load-balancer: <load-balancer private IP address>

ssl_inputs:
  internal_cert_path: '<path to the certificate generated in the first step>'
  internal_key_path: '<path to the key generated in the first step>'
  external_cert_path: <same as internal_cert_path(for CLI)>
  external_key_path: <same as internal_key_path(for CLI)>
  ca_cert_path: '<path to ca certificate>'
  external_ca_cert_path: '<path to external ca certificate for this server, can be the same one as ca_cert_path>'
  
  #If you set 'ssl_client_verification' under 'postgresql_client' to true
  postgresql_client_cert_path: '<path to cert for this server>'
  postgresql_client_key_path: '<path to key for this server>'

# For monitoring service(status reporter)

prometheus:
  blackbox_exporter:
    ca_cert_path: <ca path for blackbox exporter>
  credentials:
    username: <monitoring username>
    password: <srtong password for monitoring user>

  cert_path: <certificate for prometheus, cert_path of rabbitmq can be used>
  key_path: <key for promethus, key_path of rabbitmq can be used>
  ca_path: <ca for promethus, key_path of rabbitmq can be used>'

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
  
  #If you set 'ssl_client_verification' under 'postgresql_client' to true
  postgresql_client_cert_path: '/home/centos/.cloudify-test-ca/<ip of this host>.crt'
  postgresql_client_key_path: '/home/centos/.cloudify-test-ca/<ip of this host>.key'

# For monitoring service(status reporter)
prometheus:
  blackbox_exporter:
    ca_cert_path: '/home/centos/.cloudify-test-ca/ca.crt'
  credentials:
    username: 'monitoringusername'
    password: 'longyeteasytorememberstringasapassword'

  cert_path: <certificate for prometheus, cert_path of rabbitmq can be used>
  key_path: <key for promethus, key_path of rabbitmq can be used>
  ca_path: <ca for promethus, key_path of rabbitmq can be used>'

services_to_install:
    - manager_service
    - monitoring_service

```


### File permissions

After installing all nodes, make sure cfyuser is able to read certs you are using on managers by performing:

`sudo chmod 0755 /home/centos && sudo chown cfyuser:cfyuser -R /home/centos/.cloudify-test-ca/`

Where `.cloudify-test-ca` is the folder where all certificates located.

### Management Service Load Balancer

The Cloudify setup requires a load-balancer to direct the traffic across the Cloudify Management service cluster nodes.
Any load-balancer can be used provided that the following are supported:

1. The load-balancer directs the traffic over the following ports to the Manager nodes based on round robin or any other load sharing policy: 
   * Port 443 - REST API & UI.
   * Port 53333 - Agents to Manager communication.
   * **Note** Port 80 is not mentioned and should not be load balanced because the recommended approach is to use SSL.
1. **Session stickiness** must be kept.

#### Accessing the Load Balancer Using Cloudify Agents

In case you use a load-balancer and you want Cloudify agents to communicate with it instead of a specific Cloudify Management
service cluster node, you can use the following [Multi-Network Management guide](https://docs.cloudify.co/5.0.0/install_maintain/installation/installing-manager/#multi-network-management)
and specify the load-balancer private-IP as the value of the 'external' key under 'networks'. Moreover, In case you want all communication of the Cloudify agents
to go through the load-balancer, you can specify its private-IP as the value of the 'default' key under 'networks' (as shown in the config.yaml above).

#### Installing a Load Balancer

**Note** Although the load-balancer is not provided by Cloudify, here is a simple example of HAProxy as a load-balancer.  
In order to use HAProxy as a load-balancer, you would first need to download HAProxy to your machine and set the relevant certificates.  
Afterwards, you would need to configure HAProxy as the Cloudify Managers' load-balancer, and you can do so using the following configuration:
 
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

### Post Installation

#### Update the CLI

Update all remote CLI instances (not hosted on the manager) to the newly deployed Cloudify version. Please refer to the [CLI installation guide](http://docs.cloudify.co/5.0.5/install_maintain/installation/installing-cli/) for further instructions. 

Run the following command from the client in order to connect to the load-balancer:
```bash
cfy profiles use <load-balancer host ip> -u <username> -p <password> -t <tenant-name>
```

In case you haven't mentioned the license path in the config.yaml file of the Manager installation, you can 
upload a valid Cloudify license from the client using the following command: 
```bash
cfy license upload <path to the license file>
```

#### Day 2 cluster operations
Please refer to the [Day 2 cluster operations guide](https://docs.cloudify.co/5.0.5/ops_guides/ha_guides/cloudify_ha_day_two_ops/) for further operations regarding the Cloudify active-active cluster. 