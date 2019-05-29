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

Example of creating cert and key for host `myhost` with `1.1.1.1` IP address:

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


## PostgresSql DB
## RabbitMQ Server
## Cloudify Manager Worker