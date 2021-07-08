+++
title = "Ansible on AWS"
description = "Getting started wizard Ansible on AWS"
weight = 170
alwaysopen = false
+++

The document describes the wizard steps and resources when Ansible on AWS technology is selected.

When you select Ansible on AWS technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

* [cloudify-aws-plugin]({{< relref "/working_with/official_plugins/infrastructure/aws.md" >}})
* [cloudify-utilities-plugin]({{< relref "/working_with/official_plugins/utilities/_index.md" >}})
* [cloudify-ansible-plugin]({{< relref "/working_with/official_plugins/orchestration/ansible.md" >}})


## Blueprints

The following blueprints will be installed:

* AWS-Basics-Simple-Service-Setup (aws.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip)

## Secrets

The following secrets will be created. The value in parentheses is the secret name that will be created:

* AWS Access Key ID (aws_access_key_id)
* AWS Secret Access Key (aws_secret_access_key)
