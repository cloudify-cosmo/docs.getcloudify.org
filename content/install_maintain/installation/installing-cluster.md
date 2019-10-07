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
Make sure that your environment meets the [prerequisites]({{< relref "install_maintain/installation/prerequisites.md" >}}) 
before you install Cloudify Manager and you have read the [installation and configuration guide]({{< relref "install_maintain/installation/installing-manager.md" >}}) and deployed the manager's RPM.
{{% /note %}}

# Cloudify Cluster Architecture

![Cloudify_Cluster]( /images/cluster/cluster-architecture.png )

Cloudify Manager 5.0.5 introduces a new cluster architecture to Cloudify. 
This cluster is comprised of 3 separate services that construct the entire Cloudify solution:
1. Cloudify Management service – The Management service embeds the Cloudify workers framework, the REST API, the User Interface infrastructure and other backend services.
The Cloudify Management service is a cluster of at least two Manager nodes running in an active/active mode.
1. PostgreSQL database cluster – This service provides a high-availability PostgreSQL cluster based on [Patroni](https://patroni.readthedocs.io/en/latest/). The cluster must consist of at least 3 nodes.
1. RabbitMQ cluster – This service provides a high-availability RabbitMQ cluster based on the RabbitMQ best practices. The cluster must consist of 3 nodes.

* An optional service is the load-balancer that is Used to distribute the load between the different manager nodes.

This guide describes the process of configuring and installing such a cluster.
**Note** Although the load-balancer is not provided by Cloudify, there is an example of HAProxy as a load-balancer in the later sections.


## Certificates Setup
The Cloudify Manager cluster uses SSL protocol for three reasons:
1. Communication between the PostgreSQL cluster nodes.
1. Communication between the RabbitMQ cluster nodes.
1. Communication between the Cloudify Management service cluster nodes with the other services.

**Remark: All the following mentioned files should exist on the machine**

For each PostgreSQL and RabbitMQ cluster node we will configure the following:
1. CA certificate path - Should be identical on all instances.
1. certificate (cert) path - A certificate signed by the given CA that specifies the node's IP.
1. key path - The key associated with the certificate.

For each Cloudify Management service cluster node we will configure the following:
1. CA certificate path - Same as the one configured for the other services' nodes.

* In case the PostgreSQL service requires a client SSL verification we will also need to configure the following:  
   1. certificate (cert) path - A certificate signed by the given CA that specifies the node's IP. 
   1. key path - The key associated with the certificate. 

{{% note title="Certificates" %}}  
* The certificates should be created before proceeding with the installation process.  
* The installation process does NOT require the CA key.  
* The certificates/keys are being copied to `/etc/cloudify/ssl` during installation from the source given by the user. Therefore, it is up to the user to delete the leftovers from the source location.  
* In case of using external hosted PostgreSQL or RabbitMQ instances, the respective certificates need to be retrieved instead of created.
{{% /note %}}  
    
Example of creating certificate and key for host `myhost` with `1.1.1.2` IP address using a configuration file:  
  
1. Writing a configuration file:  
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
1. Generating certificate and key using a CA certificate, a key and a configuration file:  
    ```bash  
    sudo openssl req -newkey rsa:2048 -nodes -batch -sha256 -config conffile -out myhost.crt.csr -keyout myhost.key  
    sudo openssl x509 -days 3650 -sha256 -req -in myhost.crt.csr -out myhost.crt -extensions v3_ext -extfile conffile -CA ca.crt -CAkey ca.key -CAcreateserial  
    ```  
  
## Installing Services
The Cloudify Manager Cluster best-practice consists of three main services: PostgreSQL Database, RabbitMQ, and a Cloudify Management Service. 
Each of these services is a cluster of three nodes and each node should be installed separately by order. 
Another optional service of the Cloudify Manager Cluster is the Management Service Load Balancer, which should be installed after all the other components.  
The following sections describe how to install and configure Cloudify Manager Cluster services. The order of installation should be as follows:
1. [PostgresSQL Database Cluster ] ({{< relref "install_maintain/installation/installing-cluster.md#postgresql-database-cluster" >}})  
2. [RabbitMQ Cluster] ({{< relref "install_maintain/installation/installing-cluster.md#rabbitmq-cluster" >}})  
3. [Cloudify Management Service] ({{< relref "install_maintain/installation/installing-cluster.md#cloudify-management-service" >}}) 
4. [Management Service Load Balancer] ({{ relref "install_maintain/installation/installing-cluster.md#setting-a-load-balancer-for-the-Management-Service" >}})) 
5. [After-Installation] ({{ relref "install_maintain/installation/installing-cluster.md#after-installation" >}}))
  
 
### PostgreSQL Database Cluster [Ofer: Instead of 'Installing the PostgreSQL database cluster']

The PostgreSQL database high-availability cluster is comprised of 3 nodes (Cloudify best-practice) or more. [TODO: verify it]

**Note** Make sure the following ports are open for each node: tcp/2379 (etcd), tcp/2380 (etcd), tcp/5432 (postgres), tcp/8008 (patroni). [TODO: Are these the only ones?]

#### Externally Hosted PostgreSQL Database Installation [Does it have to use Patroni?]
 - Make sure the PostgreSQL instance is publicly available and reachable from the local Cloudify Manager Server.
  - Make sure you are using the same CA certificate for all other instances as the one on the externally hosted PostgreSQL database.

#### Locally Hosted Cloudify PostgreSQL Database Cluster Installation

Configure the following settings in `/etc/cloudify/config.yaml` for each PostgreSQL node: [TODO: Should we keep the 'ssl_only_connections' in the postgres config?]
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
            replicator_password: '<strong password for replication user>'     

    # If true, client certificate verification will be required for postgres clients.
    ssl_client_verification: false

services_to_install:
    - database_service
```
  
Execute on each node by order:  
```bash  
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]  
```  
   
### RabbitMQ Cluster
  
The RabbitMQ service is a cluster comprised of three nodes (Cloudify best-practice) or more. [TODO: Verify]
  
**Note** Reverse DNS lookup must be available in your network for the RabbitMQ nodes, 
i.e 'reverse_dns_lookup=true' in the rabbitmq.conf file. [TODO: What is it?]  

#### Externally Hosted RabbitMQ Installation [TODO: Are ther any special remarks]

#### Locally Hosted RabbitMQ Cluster Installation  
  
Configure and install the first RabbitMQ node and then the rest of the nodes.
  
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

Execute on each node by order:  
```bash  
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]  
```  
  
#### Adding RabbitMQ Node to a RabbitMQ Cluster [TODO: What is it? Should it be done from the Manager od the Rabbit?]

1. Create an FQDN for the new RabbitMQ node.
In case you're not able to create FQDN you can add the new host to `/etc/hosts` on all existing RabbitMQ nodes.
| WARNING: EDITING THE /etc/hosts FILE IS NOT RECOMMENDED AND SHOULD NOT BE USED IN PRODUCTION |
| --- |
  
1. On a Cloudify Management service cluster node, execute:  
    ```bash  
    cfy cluster brokers add <new broker name> <new broker address>  
    ```  
  
  
#### Removing RabbitMQ instances from a Cloudify Cluster [TODO: What is it? Should it be done from the Manager od the Rabbit?]  
  
1. On a RabbitMQ cluster node, execute:  
    ```bash  
    cfy_manager brokers-remove -r <name of node to remove>  
    ```  
  
1. On a Cloudify Management service cluster node, execute:  
    ```bash  
    cfy cluster brokers remove <broker name>  
    ```  
  
  
#### Verify RabbitMQ Cluster [TODO: why I need to verify this and what should I expect to get when I run the list commands.]
  
1. On a RabbitMQ cluster node, execute:  
    ```bash  
    cfy_manager brokers-list  
    ```  
  
1. On a manager worker cluster node, execute:  
    ```bash  
    cfy cluster brokers list  
    ```  
      
  
### Cloudify Management Service 
  
The Cloudify Management service is a cluster comprised of two to ten nodes, whereas Cloudify best-practice is three nodes.  
 
**Note** Make sure the following ports are open for each node: tcp/5432 (postgres), tcp/8008 (patroni)
  
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
            default: <ip of rabbit server 1> [FQDN] 
        <short host name of rabbit server 2>:
            default: <ip of rabbit server 2> [FQDN]
        <short host name of rabbit server 3>:
            default: <ip of rabbit server 3> [FQDN]

ssl_inputs:
    ca_cert_path: '<path to ca certificate>'
    internal_cert_path: '<path to cert for this server>' optional
    internal_key_path: '<path to key for this server>' optional
    external_cert_path: '<path to cert for this server>' optional
    external_key_path: '<path to key for this server>' optional
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

### Setting a Load-Balancer for the Management Service [TODO:  add a short explanation or a link to a page explaining how to setup the system when a load balancer is used such that the agents will know how to access it (if at all needed)]

The Cloudify setup requires a load-balancer to direct the traffic across the Cloudify Management service cluster nodes.  
Any load-balancer can be used provided that the following are supported:
1. The load-balancer directs the traffic over the following ports to the Manager nodes based on round Robin or any other load sharing policy: 
   * Port 443 - REST API & UI.
   * Port 53333 - Agents to Manager communication.
   * **Note** Port 80 is not mentioned and should not be load balanced because the recommended approach is to use SSL.

1. **session stickiness** must be kept.

An example configuration for a HAProxy load-balancer: [TODO: Should we use this configuration or Trammels]

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

### After Installation [TODO: Should we do it?]
Update the CLI profile by running:  
```bash  
cfy cluster update-profile  
```  