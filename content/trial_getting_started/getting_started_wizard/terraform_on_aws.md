+++
title = "Terraform on AWS"
description = "Getting started wizard Terraform on AWS"
weight = 160
alwaysopen = false
+++

The document describes the wizard steps and resources when Terraform on AWS technology is selected.

When you select Terraform on AWS technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

* [cloudify-aws-plugin]({{< relref "/working_with/official_plugins/infrastructure/aws.md" >}})
* [cloudify-utilities-plugin]({{< relref "/working_with/official_plugins/utilities/_index.md" >}})
* [cloudify-terraform-plugin]({{< relref "/working_with/official_plugins/orchestration/terraform.md" >}})


## Blueprints

The following blueprints will be installed:

* AWS-VM-Setup-using-Terraform (aws-terraform.yaml) (https://github.com/cloudify-community/blueprint-examples/releases/download/latest/virtual-machine.zip)

## Secrets

The following secrets will be created:

* AWS Access Key ID (aws_access_key_id)
* AWS Secret Access Key (aws_secret_access_key)

NOTE: To be able successfully run all the blueprints the secrets should have the following permissions:
....

## Wizard Steps

When selecting AWS technologies AWS secret configuration step will be added to the flow. The summary page will include all the resources that will be created.
 
### Secret

The step that to configure AWS Secrets:


### Summary Page

The summary page will present the following items:
