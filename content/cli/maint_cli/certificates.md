---
title: certificates
description: The `cfy certificates` commands handle certificates' maintenance procedures.
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/certificates/
---

The `cfy certificates` commands handle certificates' maintenance procedures.

## Commands

### Replacing Certificates
Certificates are used by {{< param product_name >}} for TLS based secure communication between the different {{< param product_name >}} components and between the user interface and the {{< param cfy_manager_name >}}.
Certificates are set during the initial deployment of the {{< param cfy_manager_name >}} (cluster or all-in-one),
but later maintenance and replacement of the certificates may be required as a result of regulatory compliance demand, certificate expiration, or revocation due to security breach.
Follow this procedure when certificates' replacement is required:

1. Generate the replace-certificates configuration file using `cfy certificates generate-replace-config`.
This file should be filled with the new certificates' paths.
2. Replace the certificates using `cfy certificates replace`. This command uses the filled configuration file from the previous step.

{{% note %}}
Replacing certificates can only be done **before** the existing certificates expire.
{{% /note %}}


#### generate-replace-config

##### Usage

`cfy certificates generate-replace-config`

Generates the replace-certificates configuration file. Please fill in the generated file with the new
certificates' paths and save it.

* In case you are using a management cluster, the cluster instances' private IPs will be filled automatically.
If your CLI is on a host that is not part of the cluster network, you can specify the instances' public IPs instead.
* The generated configuration file will be different depending on the deployment topology -
all-in-one manager or a management cluster.

{{% note %}}
* In case of replacing a CA certificate, all related certificates need to be replaced as well.
* For each instance, either both certificate and key must be provided, or neither.  
{{% /note %}}

##### Optional flags:

* `-o, --output-path` - The local path to download the replace-certificates config file to.
The default output path is "./certificates_replacement_config.yaml".

##### Example

{{< highlight  bash  >}}
$ cfy certificates generate-replace-config
...

The certificates replacement configuration file was saved to certificates_replacement_config.yaml

...
{{< /highlight >}}

#### replace

##### Usage
`cfy certificates replace`

This command will replace the certificates on your all-in-one manager or management cluster,
whichever you are currently using. It uses the filled configuration file in order to get the new
certificates' paths.  
At the end of the process, the old certificates are saved at the same directory as the new ones
(`/etc/cloudify/ssl/`) with a timestamp attached to their name.    

{{% note %}}
The `ssh_user` and `ssh_key` need to be configured for the current profile
prior to using this command. This can be done by using the command
`cfy profiles set --ssh-user <username, e.g. centos> --ssh-key <path to the lcal private key-path>`.
These credentials will be used in order to connect (SSH) to the cluster instances and replace their certificates.
{{% /note %}}


##### Optional flags:
* `-i, --input-path` - The certificates replacement configuration file path.
The default input path is "./certificates_replacement_config.yaml".
* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv).
Use this flag in case you want to print the logs from the remote hosts.

##### Example

{{< highlight  bash  >}}
$ cfy certificates replace
...

Validating replace-certificates config file...
Validating status is healthy
Validating certificates on host <host-ip>  
Validating certificates on host <host-ip>  

Replacing certificates...
Passing CA certs to agents    
Replacing certificates on host <host-ip>  
Replacing certificates on host <host-ip>  
Passing CA certs to agents

Validating status is healthy
Successfully replaced certificates  

...
{{< /highlight >}}
