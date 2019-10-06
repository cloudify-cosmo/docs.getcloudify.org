---
layout: bt_wiki
title: Installing and Configuring a Cloudify Manager Distributed Cluster
description: Install a Cloudify Manager Cluster environment to ensure High Availabiliy. 
category: Installation
draft: false
weight: 6
aliases:
  - /installation/installation-overview/
  - /installation/bootstrapping/
  - /installation/from-packages/
  - /installation/installing-manager/
---


{{% note title="Prerequisites" %}}
Make sure that your environment meets the [prerequisites]({{< relref "install_maintain/installation/prerequisites.md" >}}) before you install Cloudify Manager and you have read the [installation and configuration guide]({{< relref "install_maintain/installation/installing-manager.md" >}}) and deployed the manager's RPM.
{{% /note %}}

# Cloudify Cluster Architecture

![Cloudify_Cluster]( /images/cluster/cluster-architecture.png )

Cloudify Manager 5.0.5 brings a new cluster architecture to cloudify. 
This cluster is comprised of 3 separate services that construct the entire Cloudify cluster.
The services are:
1. PostgreSQL cluster - Provides a HA postgres cluster based on Patroni (at least 3 nodes).
1. RabbitMQ cluster - Based on RabbitMQ best practices (at least 3 nodes).
1. Cloudify Manager cluster - A service that provides all the UI/API/workers frameworks (at least 2 nodes active/active).
1. Load Balancer (optional) - Used to distribute the load between the different manager nodes.

This guide describes the process of configuring and installing such a cluster.
**Note** Although the load-balancer is not provided by Cloudify, there is an example of HAProxy as a LB in the later sections.

## Required certificates  
{{% note title="Certificates" %}}  
* The certificates should be created before proceeding with the installation process.  
* The installation process does NOT require the CA key.  
* The certificates/keys are being copied to `/etc/cloudify/ssl` during installation from the source given by the user. Therefore, it is up to the user to delete the leftovers from the source location.  
* In case of using external hosted PostgreSQL or RabbitMQ instances, the respective certificates need to be retrieved instead of created.
{{% /note %}}  
  
Some of the nodes require signed certificates, in addition to the CA certificate.  
  
Example of creating cert and key for host `myhost` with `1.1.1.2` IP address using a configuration file:  
  
Configuration file:  
```text  
[req]  
distinguished_name = req_distinguished_name  
x509_extensions = v3_ext  
[ req_distinguished_name ]  
commonName = _common_name # ignored, _default is used instead  
commonName_default = myhost  
[ v3_ext ]  
basicConstraints=CA:false  
authorityKeyIdentifier=keyid:true  
subjectKeyIdentifier=hash  
subjectAltName=DNS:myhost,DNS:127.0.0.1,DNS:1.1.1.2,DNS:localhost,IP:127.0.0.1,IP:1.1.1.2  
```  
  
Generating cert and key using CA cert and key and a configuration file:  
```bash  
sudo openssl req -newkey rsa:2048 -nodes -batch -sha256 -config conffile -out myhost.crt.csr -keyout myhost.key  
sudo openssl x509 -days 3650 -sha256 -req -in myhost.crt.csr -out myhost.crt -extensions v3_ext -extfile conffile -CA ca.crt -CAkey ca.key -CAcreateserial  
```  
  
## Installing components  
The Cloudify Manager Cluster best-practice consists of three main components: PostgreSQL Cluster, RabbitMQ Cluster, and a Cloudify Manager Worker Cluster. 
Each of these components consists of three nodes that should be installed separately. Another optional component of the Cloudify Manager Cluster is the Manager Worker Cluster Load-Balancer, which should be installed after all the other components.  
The following sections describe how to install and configure Cloudify Manager Cluster main components. The order of installation should be as follows:
1. [PostgresSQL DB Component] ({{< relref "install_maintain/installation/installing-cluster.md#postgresql-db-component" >}})  
2. [RabbitMQ Component] ({{< relref "install_maintain/installation/installing-cluster.md#rabbitmq-component" >}})  
3. [Cloudify Manager Worker Component] ({{< relref "install_maintain/installation/installing-cluster.md#cloudify-manager-worker-component" >}}) 
4. [Load-Balancer Component] ({{ relref "install_maintain/installation/installing-cluster.md#load-balancer-component" >}})) 

{{% note title="Externally hosted" %}}  
Note: If you are using an externally hosted DB or an externally hosted RabbitMQ, you can skip their corresponding step in the installation process and configure them during the Manager Worker Cluster installation. 
{{% /note %}}
 
After installation, update the CLI profile by running:  
```bash  
cfy cluster update-profile  
```  
  
### PostgreSQL DB Component
The PostgreSQL DB component is a cluster comprised of 3 nodes (Cloudify best-practice) or more. 

Make sure the following ports are open for each node: tcp/2379 (etcd), tcp/2380 (etcd), tcp/5432 (postgres), tcp/8008 (patroni).

#### Externally hosted PostgreSQL DB Installation

 - Make sure the PostgreSQL instance is publicly available and reachable from the local Cloudify Manager machine.
 - Download the CA certificate installed on the PostgreSQL DB instance into the local Cloudify Manager machine.

#### Locally hosted Cloudify PostgreSQL DB Installation

Configure the following settings in `/etc/cloudify/config.yaml` for each PostgreSQL node:  
```yaml  
postgresql_server:

    postgres_password: '<strong password for postgres superuser>'

    cert_path: '<path to certificate for this server>'
    key_path: '<path to key for this server>'
    ca_path: '<path to ca certificate>'
    
    cluster:
        nodes:
            - <first database server ip>
            - <second database server ip>
            - <third database server ip>
        
        etcd:
            cluster_token: '<a strong secret string (password-like)>'
            root_password: '<strong password for etcd root user>'
            patroni_password: '<strong password for patroni to interface with etcd>'
        
        patroni:
            rest_password: '<strong password for replication user>' 
        
        postgres:
            replicator_password: "<select a password>"     

    # If true, client certificate verification will be required for postgres clients.
    ssl_client_verification: false

services_to_install:
    - database_service
```
  
Execute on each node:  
```bash  
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]  
```  
  
  
### RabbitMQ Component 
  
The RabbitMQ component is a cluster comprised of at least three nodes.
  
**Note** that Reverse DNS lookup must be available in your network for the RabbitMQ nodes.  
  
#### Installing a RabbitMQ Cluster  
  
Configure the first RabbitMQ node and then the rest of the nodes.
  
For the first RabbitMQ, configure the following settings in `/etc/cloudify/config.yaml`: 
 
```yaml  
rabbitmq:

    username: cloudify
    password: '<secure password for queue management>'

    cluster_members:
        <short host name of rabbit server 1- e.g. using 'hostname -s'>:
            default: <ip of rabbit server 1>
        <short host name of rabbit server 2>:
            default: <ip of rabbit server 2>
        <short host name of rabbit server 3>:
            default: <ip of rabbit server 3>

    cert_path: '<path to certificate for this server>'
    key_path: '<path to key for this server>'
    ca_path: '<path to ca certificate>'
    
    nodename: '<short host name of this rabbit server>'
    
    erlang_cookie: '<a strong secret string (password-like)>'

services_to_install:
    - queue_service
```

For the rest of the nodes, configure the following settings in `/etc/cloudify/config.yaml`:
```yaml  
rabbitmq:

    username: '<username for quque management>'
    password: '<secure password for queue management>'

    cluster_members:
        <short host name of rabbit server 1- e.g. using 'hostname -s'>:
            default: <ip of rabbit server 1>
        <short host name of rabbit server 2>:
            default: <ip of rabbit server 2>
        <short host name of rabbit server 3>:
            default: <ip of rabbit server 3>

    cert_path: '<path to certificate for this server>'
    key_path: '<path to key for this server>'
    ca_path: '<path to ca certificate>'
    
    nodename: '<short host name of this rabbit server>'
    
    join_cluster: '<short host name of first rabbit server>'

    erlang_cookie: '<a strong secret string (password-like)>'

services_to_install:
    - queue_service
```

Execute on each node:  
```bash  
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]  
```  
  
#### Adding RabbitMQ instances to a Cloudify Cluster  
  
Add the new host to `/etc/hosts` on all existing nodes.  
  
On a manager worker cluster node, execute:  
```bash  
cfy cluster brokers add <new broker name> <new broker address>  
```  
  
  
#### Removing RabbitMQ instances from a Cloudify Cluster  
  
On a RabbitMQ cluster node, execute:  
```bash  
cfy_manager brokers-remove -r <name of node to remove>  
```  
  
On a manager worker cluster node, execute:  
```bash  
cfy cluster brokers remove <broker name>  
```  
  
  
#### Verify RabbitMQ Cluster  
  
On a RabbitMQ cluster node, execute:  
```bash  
cfy_manager brokers-list  
```  
  
On a manager worker cluster node, execute:  
```bash  
cfy cluster brokers list  
```  
  
  
### Cloudify Manager Worker Component  
  
The Cloudify Manager Worker component is a cluster comprised of between three to ten nodes. 
 
Make sure the following ports are open for each node: tcp/5432 (postgres), tcp/8008 (patroni)
  
Configure the following settings in `/etc/cloudify/config.yaml` for each Manager Worker node:  
```yaml  
manager:
    security:
        ssl_enabled: true   
        admin_password: '<strong admin password for cloudify>'
  
    cloudify_license_path: '<path to cloudify license file>'

postgresql_server:
    ssl_enabled: true
    ca_path: '<path to ca certificate>'
    cluster:
        nodes:
            - <first database server ip>
            - <second database server ip>
            - <third database server ip>

postgresql_client:
    ssl_enabled:true
    server_password: '<strong password you used to set up postgres>'
    
    # If true, client SSL certificates will need to be supplied for database connections.
    # If this is set to true, then the 'ssl_client_verification' under 'postgresql_server' 
    # in the config.yaml files of the PostgreSQL nodes should also be set to true.  
    ssl_client_verification: false

rabbitmq:
    username: '<username you configured for queue management on rabbit>'
    password: '<strong password you configured for queue management on rabbit>'
    ca_path: '<path to ca certificate>'
    cluster_members:
        <short host name of rabbit server 1- e.g. using 'hostname -s'>:
            default: <ip of rabbit server 1>
        <short host name of rabbit server 2>:
            default: <ip of rabbit server 2>
        <short host name of rabbit server 3>:
            default: <ip of rabbit server 3>

ssl_inputs:
    ca_cert_path: '<path to ca certificate>'
    internal_cert_path: '<path to cert for this server>'
    internal_key_path: '<path to key for this server>'
    external_cert_path: '<path to cert for this server>'
    external_key_path: '<path to key for this server>'
    external_ca_cert_path: '<path to cert for this server>'
    
    #If you set 'ssl_client_verification' under 'postgresql_client' to true
    postgresql_client_cert_path: '<path to cert for this server>'
    postgresql_client_key_path: '<path to key for this server>'
  
services_to_install:
    - manager_service  
```  
  
Execute on each node:  
```bash  
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]  
```  
  
  
#### Removing a manager worker node from a cluster  
  
On a manager worker cluster node, execute:  
```bash  
cfy cluster remove <host name of node to remove>  
```

### Load-Balancer Component

The Load-Balancer component is used to distribute the requests between the different Manager nodes.
An example configuration for a HAProxy load-balancer: 

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
