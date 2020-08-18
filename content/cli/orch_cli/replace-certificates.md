---
layout: bt_wiki
title: replace-certificates
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/replace-certificates/
---

{{%children style="h3" description="true"%}}

The `cfy certificates` command is used to handle procedures related to certificates. 

## Commands

### Replacing Certificates
**Use case:** The certificates on the cluster instances or on an AIO manager are about to expire and need to be replaced.  
This feature includes two steps: 
1. Generating the replace-certificates configuration file. This file should be filled with the new certificates' paths.
2. Replacing the certificates based on the paths specified in the configuration file.

{{% note %}}
Replacing certificates can be done **only before** the certificates are expired.
{{% /note %}}


#### generate-replace-config

##### Usage

`cfy certificates generate-replace-config`

Generate the replace-certificates configuration file. Please fill in the generated file with the new 
certificates' paths and save it. 
* In case you are using a Cloudify cluster, the cluster instances' private IPs will be filled automatically.
If your CLI is on a host that is not part of the cluster network, you can specify the instances' public IPs instead.
* The generated configuration file will be different depending on if you use an AIO manager or a Cloudify cluster. 

{{% note %}}
1. In case of replacing a CA certificate, all related certificates need to be replaced as well.
1. For each instance, either both certificate and key must be provided, or neither.
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
whichever you are currently using.   
This command uses the filled configuration file.  

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
Validating certificates on host <host-ip>  
Validating certificates on host <host-ip>  

Replacing certificates...    
Replacing certificates on host <host-ip>  
Replacing certificates on host <host-ip>  

Successfully replaced certificates  

...
{{< /highlight >}}
