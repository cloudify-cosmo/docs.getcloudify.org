---
layout: bt_wiki
title: Installing Cloudify Manager Cluster
category: Installation
draft: false
weight: 100
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


## Required certificates
Some of the components require signed certificates, in addition to the CA certificate.

Example of creating cert and key for host `myhost` with `1.1.1.2` IP address:

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

{{% note title="Certificates" %}}
* The certificates should be created before proceeding with the installation process.
* The installation process does NOT require the CA key.  
{{% /note %}}


## Installing components

The following sections describe how to install and configure Cloudify cluster main coponents:

1. [PostgresSql DB] ({{< relref "install_maintain/installation/installing-cluster.md#postgresql-db" >}})
1. [RabbitMQ Server] ({{< relref "install_maintain/installation/installing-cluster.md#rabbitmq-server" >}})
1. [Cloudify Manager Worker] ({{< relref "install_maintain/installation/installing-cluster.md#cloudify-manager-worker" >}})


### PostgresSql DB

Configure the following settings in `/etc/cloudify/config.yaml`:
```yaml

postgresql_server:
  enable_remote_connections: true
  ssl_enabled: true
  postgres_password: <select a password>
  
  # Optional, make Postgres server verify client certificate
  ssl_client_verification: true
  # Optional, accept SSL connections only
  ssl_only_connections: true
  
ssl_inputs:
  postgresql_server_cert_path: <path to server crt file>
  postgresql_server_key_path: <path to server key file>

  ca_cert_path: <path to CA crt file>
  
  
services_to_install:
# keep only database_service in the list of services to install
- database_service
#- queue_service
#- manager_service

```

Execute:
```bash
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
```


### RabbitMQ Server

You can install between 1 and 3 (recommended) RabbitMQ instances.

#### Installing a RabbitMQ Cluster

Configure the following settings in `/etc/cloudify/config.yaml`:
```yaml

rabbitmq:
  ca_path: <path to the CA crt file>
  cert_path: <path to the host's crt file>
  key_path: <path to the hosts's key file>
  nodename: <the hostname>
  
  # Generate a random string, for example: 7f3e952a-10b4-4e6b-8322-420ae768ab3f
  # use the same cookie in all RabbitMQ instances' installations                                           
  erlang_cookie: <generate a random string>
  
  # List all known RabbitMQ instances,
  # for each instance, provide the default IP address
  # and list all other networks
  cluster_members: 
    <hostname1>:
      default: <host1 IP>
      <additional network name>: <additional network IP>
    <hostname2>:
      default: <host2 IP>

  # On first RabbitMQ instance, leave empty
  # on other RabbitMQ instances, enter the first hostname
  join_cluster: <host1>
  
  
services_to_install:
# keep only queue_service in the list of services to install
#- database_service
- queue_service
#- manager_service

```

Execute:
```bash
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
```
    
#### Adding/Removing RabbitMQ instances from a Cloudify Cluster


    
### Cloudify Manager Worker