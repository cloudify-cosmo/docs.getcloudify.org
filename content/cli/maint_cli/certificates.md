---
layout: bt_wiki
title: certificates
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/certificates/
---

{{%children style="h3" description="true"%}}

The `cfy certificates` commands are used to handle procedures related to certificates. 

## Commands

### Replacing Certificates
**Use case:** Whe the certificates on the cluster instances or on an AIO manager are about to expire and need to be replaced.  
This feature includes two steps: 
1. Generating the replace-certificates configuration file. This file should be filled with the new certificates' paths.
2. Replacing the certificates based on the paths specified in the configuration file.

{{% note %}}
Replacing certificates can only be done **before** the certificates are expired.
{{% /note %}}


#### generate-replace-config

##### Usage

`cfy certificates generate-replace-config`

Generates the replace-certificates configuration file. Please fill in the generated file with the new 
certificates' paths and save it.
 
* In case you are using a Cloudify cluster, the cluster instances' private IPs will be filled automatically.
If your CLI is on a host that is not part of the cluster network, you can specify the instances' public IPs instead.
* The generated configuration file will be different depending on if you use an AIO manager or a Cloudify cluster. 

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

This command will replace the certificates on your AIO manager or Cloudify cluster, 
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
