---
layout: bt_wiki
title: Broker Security (RabbitMQ)
category: Manager
draft: false
weight: 1000

---

Cloudify uses RabbitMQ as its broker, and supports configurable security.

# Authentication

When installing, the Cloudify Manager must be provided with credentials for RabbitMQ. These will use default values if not overridden in the inputs.

## Username

It is suggested that you change the username to something other than the default. It is recommended that you use only upper and lower case letters and numbers for the username.

The username can be set using the `rabbitmq_username` input to the manager blueprint.

## Password

It is recommended that you set the password to something strong that is known only to those who are authorized.

It is recommended that the password is comprised of only ASCII characters, excluding quotes, line feeds, and dollar signs, as these may cause the password to be set incorrectly during the installation.

The password should be set using the `rabbitmq_password` input to the manager blueprint.

## With external broker

If you are using an external broker you must have correctly configured the user on the external RabbitMQ broker. This user must have full permissions on the root (`/`) vhost.

No changes of configuration of the external broker will be performed during the installation.

# Network Encryption

Communications with the broker can be secured (with some exceptions, see below) using SSL/TLS.

A certificate from a certificate authority is not required, as the provided public certificates will be 'pinned' (they will be the only certificates valid for connections to the broker).

Currently you will likely need to create the manager with a specified IP in order to appropriately create the certificate- see instructions for generating the certificate, below.

## Generating a certificate

If you wish to generate a self-signed certificate, you can do so using the following command (assuming a manager IP of 192.0.2.10, command tested on Ubuntu Linux 14.04):

{{< highlight  sh  >}}
MANAGER_ADDRESS=192.0.2.10
openssl req -x509 -newkey rsa:2048 -sha256 -keyout private.key -out public.crt -days 1825 -nodes -subj "/CN=${MANAGER_ADDRESS} /subjectAltName=IP:127.0.0.1,DNS:localhost,IP:${MANAGER_ADDRESS}"
{{< /highlight >}}

Note also that:

* This certificate is valid for 5 years (`-days 1825`).
* The signed public certificate will be in `public.crt`.
* The private key will be in `private.key`.

## Using a certificate to secure broker communications

Once you have public and private certificates you will need to provide the following inputs to the manager blueprint:

```
rabbitmq_ssl_enabled: true
rabbitmq_cert_public: |
  -----BEGIN CERTIFICATE-----
  ... contents of PEM formatted public certificate- public.crt if using the key generation command listed above ...
  -----END CERTIFICATE-----
rabbitmq_cert_private: |
  -----BEGIN PRIVATE KEY-----
  ... contents of PEM formatted private key- private.key if using the key generation command listed above ...
  -----END PRIVATE KEY-----
```

Note the pipe followed by the indented, full PEM certificate including the `BEGIN` and `END` lines.

Once you have provided the certificate and completed the installation you should ensure that the private key (including the copy in the inputs file) is appropriately secured.

{{% note title="Note" %}}
Cloudify agents require Python 2.7.9+ in order to connect to the RabbitMQ service on the manager using TLS 1.2 (recommended TLS version).

Cloudify agent for Windows is packed with Python 2.7.9 but will not install it if Python is already installed on the host.
{{% /note %}}


## Using an External Broker

If you are using an external broker, you must have correctly configured the SSL/TLS on port 5671 on the broker with the appropriate private key. It must also listen on the standard unsecured port (5672).

**Using an external broker reduces communications security due to some exceptions to the encryption - see [below]({{< relref "using_cloudify/manager/broker-security.md" >}}#rabbitmq-ssl-and-tls-exceptions), which results in RabbitMQ credentials being transmitted insecurely over the network.**

Do not provide the `rabbitmq_cert_private` input if you are using an external broker, however you must still specify the `rabbitmq_ssl_enabled` input as shown above.

No changes to the configuration of the external broker are performed during the installation process.

## RabbitMQ SSL and TLS Exceptions

Several components are not currently secured via SSL (though password authentication will still apply). These components are only used internally to the Manager.

The unsecured components are:

* Logstash
* Riemann
* Certain internal Manager communications

All external communications (meaning those with agents that are deployed on compute nodes) **are** encrypted.
