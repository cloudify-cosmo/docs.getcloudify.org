+++
title = "Getting Started Wizard Ansible on AWS"
description = "Getting started wizard Ansible on AWS"
weight = 97
alwaysopen = false
+++

The document describes the wizard steps and resources when Ansible on AWS technology is selected.

When you select Ansible on AWS technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:
- [cloudify-aws-plugin]({{< relref "/working_with/official_plugins/infrastructure/aws/" >}})
- [cloudify-utilities-plugin]({{< relref "/working_with/official_plugins/utilities/" >}})
- [cloudify-ansible-plugin]({{< relref "/working_with/official_plugins/orchestration/ansible/" >}})


## Blueprints

The following blueprints will be installed:
- AWS-Basics-Simple-Service-Setup (aws.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip)

## Secrets

The following secrets will be created:

- AWS Access Key ID (aws_access_key_id)
- AWS Secret Access Key (aws_secret_access_key)

NOTE: To be able successfully run all the blueprints the secrets should have the following permissions:
....

## Wizard Steps

When selecting AWS technologies AWS secret configuration step will be added to the flow. The summary page will include all the resources that will be created.
 
### Secret

The step that to configure AWS Secrets:


### Summary Page

The summary page will present the following items:
