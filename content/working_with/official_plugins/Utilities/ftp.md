---
layout: bt_wiki
title: FTP Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the **utilities plugin**.
{{% /note %}}

# Cloudify Utilities: FTP Plugin

The FTP utility allows you to upload files by FTP to a remote host.

# Node types:

## cloudify.nodes.ftp
**Derived From:** [cloudify.nodes.Root]({{< relref "developer/blueprints/built-in-types.md" >}})

This node type describes the files to transfer and the FTP server details.


**Properties:**


  * `resource_config` - a dictionary that represent the ftp server authentication parameters.

    *type:* cloudify.datatypes.ftp_auth
    
    *required:* true
    
`cloudify.datatypes.ftp_auth` structure (from plugin.yaml):
```yaml
  cloudify.datatypes.ftp_auth:
    properties:
      user:
        description: >
          The login credentials for ftp server.
        default: ''
      password:
        description: >
          optional, ftp password
        default: ''
      ip:
        description: >
          optional, device ip
        default: ''
      port:
        description: >
          optional, ftp port
        default: 21
      ignore_host:
        description: >
          optional, ignore host in ftp response
        default: false
      tls:
        description: >
          optional, use tls connection to ftp
        default: false
```
    
  * `raw_files` - files from blueprint folder to upload.
  
     *type:* dict
     
     *required:* false
     
     The format is <file_name on ftp server>:<file path on blueprint dir>
     
  * `files` - files with inline content in blueprint to upload.
     
     *type:* dict
     
     *required:* false
     
     The format is <file_name on ftp server>:<file content>
     
## Example:

See FTP plugin [examples](https://github.com/cloudify-community/blueprint-examples/tree/master/utilities-examples/cloudify_ftp).
