---
layout: bt_wiki
title: File Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the **utilities plugin**.
{{% /note %}}

# Cloudify Utilities: Files Plugin

The files utility allows you to package a file with a blueprint and move it onto a managed Cloudify Compute node.


**Properties:**


  * `resource_config` - a dictionary that represent the file resource.

    *type:* cloudify.datatypes.File
    
    *required:* true

`cloudify.datatypes.File` structure (from plugin.yaml):

```yaml
  cloudify.datatypes.File:
    properties:
      resource_path:
        type: string
        description: >
          The path relative to the blueprint where the file is stored.
          Currently this must be packaged in the blueprint. An external URI is
          not valid.
        required: true
      file_path:
        type: string
        description: >
          The path on the machine where the file should be saved.
        required: true
      owner:
        type: string
        description: >
          The owner string, such as "centos:wheel"
        required: true
      mode:
        type: integer
        description: >
          The file permissions, such as 777. Must be provided as an integer.
          "0777" and 0777 are not valid. Only 777.
        required: true
      template_variables:
        description: >
          Variables to render Jinja templates.
        required: false
      use_sudo:
        type: boolean
        description: >
          Whether or not to use sudo to move, rename, delete, chown, chmod,
          the file.
        default: false
      allow_failure:
        type: boolean
        description: >
          If the download fails, log the error and continue.
        default: false

```

## Examples:

**Add a repo file to a VM:**

_Blueprint Node Template:_


```yaml
  docker_yum_repo:
    type: cloudify.nodes.File
    properties:
      resource_config:
        resource_path: resources/docker.repo
        file_path: /etc/yum.repos.d/docker.repo
        owner: root:root
        mode: 644
```

**Note:**
If used in order to transfer file to remote host that defined in the blueprint use `cloudify.relationships.contained_in` relationship (see [openstack-blueprint.yaml](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_files/openstack-blueprint.yaml) example). 

_Content of resources/docker.repo:_

```yaml
[dockerrepo]
name=Docker Repository
baseurl=https://yum.dockerproject.org/repo/main/centos/7/
enabled=1
gpgcheck=1
gpgkey=https://yum.dockerproject.org/gpg
```

See also the files plugin [examples](https://github.com/cloudify-community/blueprint-examples/tree/master/utilities-examples/cloudify_files).
