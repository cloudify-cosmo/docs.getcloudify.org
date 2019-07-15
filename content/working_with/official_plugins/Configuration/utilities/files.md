---
layout: bt_wiki
title: File Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the [utilities plugin]({{< relref "working_with/official_plugins/Configuration/utilities/_index.md" >}}).
{{% /note %}}

# Cloudify Utilities: Files Plugin

The files utility allows you to package a file with a blueprint and move it onto a managed Cloudify Compute node.


## Examples:

**Add some repo to a VM:**

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

_Content of resources/docker.repo:_

```yaml
[dockerrepo]
name=Docker Repository
baseurl=https://yum.dockerproject.org/repo/main/centos/7/
enabled=1
gpgcheck=1
gpgkey=https://yum.dockerproject.org/gpg
```
