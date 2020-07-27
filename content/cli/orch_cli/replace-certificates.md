---
layout: bt_wiki
title: replace-certificates
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/replace-certificates/
---

The `cfy replace-certificates` command is used to easily replace certificates on the cluster instances.

## Commands

### generate-config

#### Usage
`cfy replace-certificates generate-config`

Generate the replace-certificates config file. This file is pre-filled with the cluster instances' IPs, 
and the user should fill in the new certificates' paths. 

{{% note %}}
1. In case of replacing a CA certificate, all related certificates need to be replaced as well.
E.g. if the RabbitMQ CA cert is replaced, all the RabbitMQ instances' certificates need to be replaced.   
**Special case:** In case  of replacing the "postgresql_server" CA cert, the "manager" instances' 
postgresql_client certificates need to be replaced as well. 
1. For each instance, either both certificate and key must be provided, or neither.
{{% /note %}}

#### Optional flags:

* `-o, --output-path` - The local path to download the replace-certificates config file to.
The default output path is "./certificates_replacement_config.yaml".

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy replace-certificates generate-config
...

The certificates replacement configuration file was saved to certificates_replacement_config.yaml

...
{{< /highlight >}}

### start

#### Usage
`cfy replace-certificates start`

Start replacing certificates on the cluster instances.

{{% note %}}
The `ssh_user` and `ssh_key` need to be configured for the current profile 
prior to using this command. This can be done by using the command 
`cfy profiles set --ssh-user <username, e.g. centos> --ssh-key <path to the lcal private key-path>`.
These credentials will be used in order to connect (SSH) to the cluster instances and replace their certificates. 
{{% /note %}}


#### Optional flags:
* `-i, --input-path` - The certificates replacement configuration file path.
The default input path is "./certificates_replacement_config.yaml".
* `-f, --force` - Use the force flag in case you want to change only a 
CA and not the certificates signed by it. **Not recommended!** 

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy replace-certificates start
...

Validating replace-certificates config file...  
Validating certificates on host <host-ip>  
Validating certificates on host <host-ip>  

Replacing certificates...    
Replacing certificates on host <host-ip>  
Replacing certificates on host <host-ip>  

Successfully replaced certificates  

...
{{< /highlight >}}
