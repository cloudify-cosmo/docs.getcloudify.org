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

The blueprints bellow will be installed, to get more information regarding the blueprint and how manually to install it click on the blueprint.

* [AWS-VM-Setup-using-Terraform]({{< relref "/trial_getting_started/examples/automation_tools/aws_terraform_basics.md" >}})


## Secrets

The following secrets will be created. The value in parentheses is the secret name that will be created:

* AWS Access Key ID (aws_access_key_id)
* AWS Secret Access Key (aws_secret_access_key)