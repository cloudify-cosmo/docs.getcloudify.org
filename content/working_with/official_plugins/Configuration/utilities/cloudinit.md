---
layout: bt_wiki
title: Cloud Init Plugin
category: Official Plugins
draft: false
weight: 100
---

{{%children style="h3" description="true"%}}


{{% note %}}
These features are part of the **utilities plugin**.
{{% /note %}}

# Cloudify Utilities: Cloud-Init

Cloud-Init is the standard for configuration of cloud instances. See [examples](http://cloudinit.readthedocs.io/en/latest/topics/examples.html).


# External files/jinja2 templates in write_files.content

To use files from blueprint directory as template for files in `write_files`
(content resource_config -> write_files -> content), it has to be defined as
a dictionary which may contain three keys:

  * `resource_type`: if it's filled with string "file_resource", the plugin
will be looking for resources under the path defined in `resource_name`,
  * `resource_name`: defines the path, where the resource resides,
  * `template_variables`: if not empty, this dictionary is being used to fill
the resource content (jinja2 template) with variables.


## Examples:

**Install mariadb on AWS instance.**

_VM Node Template:_

```yaml
  host:
    type: cloudify.nodes.aws.ec2.Instances
    properties:
      agent_config:
        install_method: none
        port: 22
      resource_config:
        ImageId: { get_attribute: [ ubuntu_trusty_ami, aws_resource_id ] }
        InstanceType: t2.medium
        kwargs:
          BlockDeviceMappings:
          - DeviceName: '/dev/sda1'
            Ebs:
              DeleteOnTermination: True
          Placement:
            AvailabilityZone: { get_input: aws_availability_zone }
          UserData: { get_attribute: [ cloudinit, cloud_config ] }
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



# Cloudbase-init example

For more info, see [documentation](https://cloudbase-init.readthedocs.io/en/latest/userdata.html).

```
  user_data_init:
    type: cloudify.nodes.CloudInit.CloudConfig
    properties:
      resource_config:
        users:
          - name: cloudify
            gecos: 'Cloudify Agent User'
            primary_group: Users
            groups: Administrators
            passwd: { get_input: cloudify_password }
            inactive: False
            expiredate: "2020-10-01"
        write_files:
        - content:
            resource_type: file_resource
            resource_name: scripts/domain.ps1
            template_variables:
              DC_IP: { get_input: cloudify_dc_ip }
              DC_NAME: { get_input: cloudify_dc_name }
              DC_PASSWORD: { get_input: cloudify_dc_password }
          path: C:\domain.ps1
          permissions: '0644'
        runcmd:
        - 'powershell.exe C:\\domain.ps1'
```


For more examples, see [cloud init examples](https://github.com/cloudify-community/blueprint-examples/tree/master/utilities-examples/cloudify_cloudinit).