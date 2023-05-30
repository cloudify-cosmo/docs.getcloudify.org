---
title: Certificates Overview
description: Go over the certificates setup.
weight: 40
---

## Certificates Overview
In cryptography, a **public key certificate**, also known as a digital certificate or identity certificate, is an electronic document used to prove the ownership of a public key.
The certificate includes information about the key, information about the identity of its owner (called the subject),
and the digital signature of an entity that has verified the certificate's contents (called the issuer).
If the signature is valid, and the software examining the certificate trusts the issuer, then it can use that key to communicate securely with the certificate's subject.  
In a typical public-key infrastructure (PKI) scheme, the certificate issuer is a certificate authority (CA),
usually a company that charges customers to issue certificates for them.

In TLS (an updated replacement for SSL), a server is required to present a certificate as part of the initial connection setup.
A client connecting to that server will perform the certification path validation algorithm:

1. The subject of the certificate matches the hostname (i.e. domain name) to which the client is trying to connect
1. The certificate is signed by a trusted certificate authority (CA)

(Taken from [Wikipedia](https://en.wikipedia.org/wiki/Public_key_certificate))


## Cluster Certificates Setup {#cluster-certificates-setup}
The {{< param cfy_manager_name >}} cluster uses the TLS protocol (as described above) for:

1. Communication between the PostgreSQL cluster nodes.
1. Communication between the RabbitMQ cluster nodes.
1. Communication between the Management service cluster nodes and the other services.

A few notes:

* The certificates/ keys should be created before proceeding with the installation process and in a PEM format
* The certificates/ keys are copied to `/etc/cloudify/ssl` during installation from the source given by the user
Therefore, it is up to the user to delete the leftovers from the source location.  
* In the case of using externally hosted PostgreSQL or RabbitMQ instances, the CA needs to be retrieved from the cloud service hosting the instance
* The **same CA** should be used to sign all cluster hosts' certificates

The following files should exist on each host:

1. CA Certificate - The CA certificate that signed the hosts' public key certificates.
1. Public Key Certificate - A public key certificate signed by the given CA that specifies the host IP and username.
1. Private Key - The private key associated with the host's public key certificate.

The `cfy_manager generate-test-cert` command can be used for creating example certificates.

On a host that has the management service installed, you can generate certificates for all hosts using:

For a nine nodes cluster:
```
cfy_manager generate-test-cert -s <manager 1 ip>,<manager 1 hostname>
cfy_manager generate-test-cert -s <manager 2 ip>,<manager 2 hostname>
cfy_manager generate-test-cert -s <manager 3 ip>,<manager 3 hostname>
cfy_manager generate-test-cert -s <postgres server 1 ip>,<postgres 1 hostname>
..
..
cfy_manager generate-test-cert -s <rabbitmq server 3 ip>,<rabbitmq server 3 hostname>
```

For a three nodes cluster:
```
cfy_manager generate-test-cert -s <node 1 ip>,<node 1 hostname>
cfy_manager generate-test-cert -s <node 2 ip>,<node 2 hostname>
cfy_manager generate-test-cert -s <node 3 ip>,<node 3 hostname>
```

{{% note %}}  
The commands above should be run on the same host.
For production purposes, please use a proper CA (e.g. a company CA).
{{% /note %}}  


## All-in-one Certificates Setup
For an all-in-one {{< param cfy_manager_name >}}, just the host's public key certificate is needed alongside its associated CA certificate and private key.


## Replacing Certificates
Replacement of the certificates may be required due to regulatory compliance demand, certificate expiration, or revocation due to a security breach.
Follow the procedure described in the [Replacing Certificates guide]({{< relref "cli/maint_cli/certificates.md#replacing-certificates" >}}) when a certificate replacement is required.
