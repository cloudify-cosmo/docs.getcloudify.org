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
* The certificates/keys are being copied to `/etc/cloudify/ssl` during installation from the source given by the user. Therefore, it is up to the user to delete the leftovers from the source location.
* In case of using external hosted PostgreSQL or RabbitMQ instances, the respective certificates need to be retrieved instead of created.
{{% /note %}}


## Installing components

The following sections describe how to install and configure Cloudify cluster main coponents:

1. [PostgresSQL DB] ({{< relref "install_maintain/installation/installing-cluster.md#postgresql-db" >}})
1. [RabbitMQ Server] ({{< relref "install_maintain/installation/installing-cluster.md#rabbitmq-server" >}})
1. [Cloudify Manager Worker] ({{< relref "install_maintain/installation/installing-cluster.md#cloudify-manager-worker" >}})

After installation, update the CLI profile by running:
```bash
cfy cluster update-profile
```

### PostgresSQL DB

#### Externally hosted PostgreSQL DB Installation

 - Make sure the PostgreSQL instance is publicly available and reachable from the local Cloudify Manager machine.
 - Download the CA certificate installed on the PostgreSQL DB instance into the local Cloudify Manager machine.
 
#### Locally hosted Cloudify PostgreSQL DB Installation

Configure the following settings in `/etc/cloudify/config.yaml`:
```yaml

postgresql_server:
  enable_remote_connections: true
  ssl_enabled: true
  postgres_password: "<select a password>"

  # Optional, make Postgres server verify client certificate
  ssl_client_verification: false
  # Optional, accept SSL connections only
  ssl_only_connections: false

ssl_inputs:
  postgresql_server_cert_path: "<path to server crt file>"
  postgresql_server_key_path: "<path to server key file>"
  postgresql_ca_cert_path: "<path to CA crt file>"


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
  ca_path: "<path to the CA crt file>"
  cert_path: "<path to the host's crt file>"
  key_path: "<path to the hosts's key file>"
  nodename: "<the hostname>"

  # Generate a random string, for example: 7f3e952a-10b4-4e6b-8322-420ae768ab3f
  # use the same cookie in all RabbitMQ instances' installations
  erlang_cookie: "<generate a random string>"

  # List all known RabbitMQ instances,
  # for each instance, provide the default IP address
  # and list all other networks
  cluster_members:
    <hostname1>:
      default: "<host1 IP>"
      <additional network name>: "<additional network IP>"
    <hostname2>:
      default: "<host2 IP>"

  # On first RabbitMQ instance, leave empty
  # on other RabbitMQ instances, enter the first hostname
  join_cluster: "<host1>"


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


### Cloudify Manager Worker

You can install between 1 and 10 (at least 3 recommended) manager instances.

Configure the following settings in `/etc/cloudify/config.yaml`:
```yaml

manager:

  # Must be set when installing the first node of a cluster.
  # Must not use when joining a cluster.
  cloudify_license_path: "<path to license file>"

  security:
    # Password for the admin user
    # must be the same on all cluster nodes
    admin_password: "<admin user password>"

rabbitmq:
  ca_path: "<path to the CA crt file>"

  # List all known RabbitMQ instances,
  # for each instance, provide the default IP address
  # and list all other networks
  cluster_members:
    <hostname1>:
      default: "<host1 IP>"
      <additional network name>: "<additional network IP>"
    <hostname2>:
      default: "<host2 IP>"

postgresql_client:
  host: "<DB host IP>"
  ssl_enabled: true

  # Optional, make Postgres server verify client certificate
  # use only if set during PostgreSQL server installation
  ssl_client_verification: false

  # Enter same password used in postgres_password when installing the PostgreSQL server
  postgres_password: "<postgresql password>"


ssl_inputs:

  # Optional, required if using ssl_client_verification
  postgresql_client_cert_path: ''
  postgresql_client_key_path: ''

  postgresql_ca_cert_path: "<path to CA crt file>"


services_to_install:
# keep only manager_service in the list of services to install
#- database_service
#- queue_service
- manager_service

```

Execute:
```bash
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
```


#### Removing a manager worker node from a cluster

On a manager worker cluster node, execute:
```bash
cfy cluster remove <host name of node to remove>
```
