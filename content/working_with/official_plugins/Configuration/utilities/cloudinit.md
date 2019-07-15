---
layout: bt_wiki
title: Cloud Init Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the [utilities plugin]({{< relref "working_with/official_plugins/Configuration/utilities/_index.md" >}}).
{{% /note %}}

# Cloudify Utilities: Cloud-Init

Cloud-Init is the standard for configuration of cloud instances. See [examples](http://cloudinit.readthedocs.io/en/latest/topics/examples.html).

## Examples:

**Install stuff on AWS**

_VM Node Template:_

```yaml
  host:
    type: cloudify.nodes.aws.ec2.Instances
    properties:
      agent_config:
        network: { get_input: manager_network }
        install_method: init_script
        user: { get_input: agent_user }
        key: { get_secret: agent_key_private }
      resource_config:
        MaxCount: 1
        MinCount: 1
        ImageId: { get_input: ami }
        InstanceType: { get_input: instance_type }
        kwargs:
          BlockDeviceMappings:
          - DeviceName: '/dev/sda1'
            Ebs:
              DeleteOnTermination: True
          Placement:
            AvailabilityZone: { get_attribute: [ aws, deployment, outputs, availability_zone ] }
          UserData: { get_attribute: [ cloudify_host_cloud_config, cloud_config ] }
      client_config: *client_config
```

_Cloud Init Node Template:_

```yaml
  cloudify_host_cloud_config:
    type: cloudify.nodes.CloudInit.CloudConfig
    properties:
      resource_config:
        users:
          - name: { get_input: agent_user }
            primary-group: wheel
            shell: /bin/bash
            sudo: ['ALL=(ALL) NOPASSWD:ALL']
            ssh-authorized-keys:
              - { get_input: agent_key_public }
        write_files:
          - path: /etc/yum.repos.d/mariadb.repo
            owner: root:root
            permissions: '0444'
            content: |
              [mariadb]
              name = MariaDB
              baseurl = http://yum.mariadb.org/10.1/centos7-amd64
              gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
              gpgcheck=1
        packages:
          - [MariaDB-server]
          - [MariaDB-client]
          - [MariaDB-compat]
          - [galera]
          - [socat]
          - [jemalloc]
          - [python-pip]
          - [python-wheel]
          - [python-setuptools]
          - [python-devel]
          - [mysql-devel]
          - [MySQL-python]
          - [firewalld]
          - [xinetd]
        runcmd:
          - 'setenforce 0'
          - [ systemctl, enable, mariadb ]
          - [ systemctl, start, mariadb ]
```