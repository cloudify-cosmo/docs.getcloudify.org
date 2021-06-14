+++
title = "AWS"
description = "Getting started wizard AWS"
weight = 100
alwaysopen = false
+++

The document describes the wizard steps and resources when AWS technology is selected.

When you select AWS technology the following resources will be downloaded and configured.

## Plugins

The following plugins will be installed:

* [cloudify-aws-plugin]({{< relref "/working_with/official_plugins/infrastructure/aws.md" >}})
* [cloudify-utilities-plugin]({{< relref "/working_with/official_plugins/utilities/_index.md" >}})
* [cloudify-kubernetes-plugin]({{< relref "/working_with/official_plugins/orchestration/kubernetes.md" >}})


## Blueprints

The blueprints bellow will be installed, to get more information regarding the blueprint and how manually to install it click on the blueprint.

* [AWS-Basics-VM-Setup]({{< relref "/trial_getting_started/examples/basic/aws_basics.md" >}})
* [AWS-VM-Setup-using-CloudFormation]({{< relref "/trial_getting_started/examples/automation_tools/aws_cloudformation_basics.md" >}})
* Kubernetes-AWS-EKS


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
