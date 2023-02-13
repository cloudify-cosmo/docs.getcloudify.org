+++
title = "Communication"
description = "Communication"
weight = 20
alwaysopen = false
+++

## Scope

Communication from the external environment to {{< param cfy_manager_name >}} and its SSL/TLS configuration is the user’s responsibility (CA/host verification, etc.), where the endpoints include the UI and REST API.
Communication between {{< param cfy_agent_name >}}s and {{< param cfy_manager_name >}} (and within {{< param cfy_manager_name >}}) is the responsibility of {{< param product_name >}} and is determined by {{< param product_name >}}. {{< param product_name >}} generates the necessary certificates for internal communication.
Credentials do not appear in log files (cloud/ RabbitMQ/ Cloudify).

## Communication Channels

* Internal services access the REST API/ file server over HTTPS on port 53333
through the manager's private IP with a {{< param product_name >}}-generated authentication token.
* External access to REST API/ file server (e.g. CLI, UI) is done by
default over HTTP through the manager's public IP but can be
configured to use HTTPS with a customer-signed certificate. Authentication
is done via a {{< param product_name >}}-generated authentication token or with a username and password.
* Agents access the manager over two secure channels: AMQP (5671) and
HTTPS (53333). By default, agents access the manager over its private IP,
but it can be configured to use other additional IPs.

## SSL for Internal Communication {#customizing-ssl-for-internal-communication}

All internal communications between internal services/ agents and the
REST API/ RabbitMQ are done over SSL.

During the bootstrap, the manager creates (or accepts as input) an internal
CA certificate and key. {{< param product_name >}} then creates an SSL keypair with a matching
certificate that contains the private IP and all the management network IPs
as its CN value. The keypair is used by both RabbitMQ and REST API/ file server
for internal access.

As part of the agent's installation script, {{< param product_name >}}'s internal CA certificate is
propagated to the agent's host in order to validate the manager's certificate.
There are no agent-host certificates.

## Customizing SSL for Internal Communication 

You can override the Internal Manager certificate and the CA certificate
in the {{< param cfy_manager_name >}} configuration. To provide a custom internal CA certificate
for the agents to use, add the `ca_certificate` and optionally `ca_key` inputs must be set
in the `/etc/cloudify/config.yaml` file during ([installation or update]({{< relref "cloudify_manager/premium/aio/install_and_configure/centos_rhel.md#step-6-prepare-the-inputs-file" >}})
of the {{< param cfy_manager_name >}}.
To provide a custom internal certificate, use the `internal_certificate` and
`internal_key` inputs. If none are provided, {{< param product_name >}} will generate the CA and
the internal certificate automatically.

{{% note title="Note" %}}
If provided, the internal certificate must be generated with the appropriate
`subjectAltName` extension to allow connections over every used Manager IP or hostname.
The internal certificate must be signed by the CA certificate.
{{% /note %}}

{{% note title="Note" %}}
If the `ca_certificate` and `ca_key` inputs are provided, the internal certificate
will be generated and signed using the provided CA. If the `ca_certificate` is
provided, but `ca_key` is NOT provided, then {{< param product_name >}} cannot generate the internal
certificate and the `internal_certificate` and `internal_key` inputs are required.
<br><br>
In order to use a {{< param cfy_manager_name >}} cluster, the CA key must be present - either
generated automatically by {{< param product_name >}} or passed in the `ca_key` input.
{{% /note %}}

## SSL Mode for External Communication

{{< param cfy_manager_name >}} by default doesn't use SSL for external communication.
You can set the manager to use SSL for external communication during bootstrap or after bootstrap.

During bootstrap, you can edit the manager blueprint input.
In the Security Settings section, set `ssl_enabled` parameter to true, in order to set the manager SSL mode.

You can set the rest_certificate and rest_key parameters, to use your own certificate.
If missing, the manager will auto-generate the certificate.

After the initial installation, you can alter the entries in `/etc/cloudify/config.yaml` and run `cfy_manager configure` again to change the {{< param cfy_manager_name >}} settings.
You can also change the manager certificate by using the replace methods under `cfy certificates`.

When you install with the SSL mode, the certificate will be copied to the local CLI profile.
When using a CA-signed certificate, provide the CA as the `external_ca_cert_path` input.

In order to update the certificate in the CLI profile, run the following command:
```
cfy profile set --rest-certificate CA_CERT_PATH
```

In case you renew the certificate, update it on the manager by using the replace methods under:
```
cfy certificates
```

