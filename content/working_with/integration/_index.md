---
title: CI/CD Interaction
description:
weight: 90
alwaysopen: false
---

{{%children style="h3" description="true"%}}


## Overview

![Jenkins Plugin]( /images/jenkins/jenkins-plugin.png )

The Jenkins Plugin for Cloudify, provided with version 5.0.5 onward, allows Jenkins authors to embed Cloudify functions within jobs and pipelines, thus simplifying the usage of the Cloudify Manager through Jenkins.

### Plugin contents

The plugin provides:

* Discrete build steps for basic Cloudify functions (uploading / deleting blueprints, creating / deleting environments, workflow execution and so forth)
* A standard Jenkins _Build Wrapper_, a convenient enclosure for other build steps that sets up a Cloudify environment before the main steps and deletes the environment afterwards
* Build steps for integration with other provisioning tools:
    * Azure ARM
    * AWS CloudFormation
    * Terraform
    * Ansible

    # Jenkins Plugin for Cloudify

    This module provides tight integration between Jenkins and Cloudify, simplifying using
    Cloudify Manager through Jenkins jobs and pipelines.

    For more information, refer to the following presentation and video: https://docs.google.com/presentation/d/1f4zcKQhV0Us7jA8s7z7-VarDxaTZaAQqr1sMrwABGVo

## Prerequisites

Jenkins version: 2.204.1+

## Examples

This repository contains a few examples of job definitions making use of features included in this plugin.
You can find them in [examples/jobs](examples/jobs).

To import these definitions into Jenkins, use the Jenkins CLI. For example:

```bash
java -jar jenkins-cli.jar -s <jenkins_url> create-job <job_name> < path_to_job_xml_file
```

For example:

```bash
java -jar jenkins-cli.jar -s <jenkins_url> create-job <job_name> < examples/jobs/cloudify-wrapper-with-git.xml
```

## Terminology

### Deployment Outputs File

Certain build steps (such as the "Create Environment" build step, or the "Cloudify" wrapper) allow
you to write a "Deployment Outputs File" at the end of creating the environment. This file can be
used by subsequent build steps, to gather information about the environment that had just been
created.

The file is a JSON file, which adheres to the following format:

```
{
    "deployment": {
        "id": deployment_id
    },
    "outputs": {
        "output_1_name": output_1_value,
        "output_2_name": output_2_value,
        ...
    },
    "capabilities": {
        "cap_1_name": cap_1_value,
        "cap_2_name": cap_2_value,
        ...
    }
}
```

For example:

```json
{
    "deployment": {
        "id": "test_env"
    },
    "outputs": {
        "endpoint": "10.0.0.131",
        "auth_info": {
            "username": "admin",
            "password": "very_secret"
        }
    },
    "capabilities": {}
}
```

The example above shows two outputs (one of them is a dictionary), and no capabilities.

### Inputs Mapping File

Often, the outputs of a deployment (see "Deployment Outputs File" above) are used, in whole or in part, as inputs
to subsequent Cloudify operations. This transformation can be accomplished in various Cloudify build-steps
by providing an *inputs mapping file*, which is a YAML/JSON file that provides mapping information.

The structure of an inputs mapping file is as follows:

```
{
    "outputs": {
        "output_1_name": "input_1_name",
        "output_2_name": "input_2_name",
        ...
    },
    "capabilities": {
        "cap_1_name": "input_3_name",
        "cap_2_name": "input_4_name",
        ...
    }
}
```

For example, considering the outputs file above, and the following mapping file:

```json
{
    "outputs": {
        "endpoint": "endpoint_ip",
        "auth_info": "user_info"
    }
}
```

The resultant JSON file will look like this:

```json
{
    "endpoint_ip": "10.0.0.131",
    "user_info": {
        "username": "admin",
        "password": "very_secret"
    }
}
```

## Installation

At the moment, this plugin is not available through Jenkins' official plugins repository.
To install the plugin, download the HPI file from the "releases" section and install it
via Jenkins' "Advanced" panel in the "Manage Plugins" section.

## Configuration

### Cloudify Manager Endpoint

You should define the Cloudify Manager endpoint in Jenkins' console ("Manage Jenkins" ->
"Configure System", look for "Cloudify Manager").

You can also specify a Cloudify tenant to use by default. If none is provided, then Cloudify's
default tenant (`default_tenant`) will be used.

**NOTE**: When using an SSL-secured Cloudify Manager, the Manager's external-facing certificate must either be:

* Signed by a publicly-trusted CA; or
* Signed by a CA whose certificate exists in the JRE's trust store; or
* Imported (along with any intermediary certificates, if any) into the JRE's trust store

### Credentials

Most Cloudify-related functionality requires credentials to operate. Cloudify doesn't offer its own Jenkins credentials type; you should use
the standard, out-of-the-box "Username with Password" credentials type.

## General Usage Notes

### Passing Credentials

The passing of credentials to Jenkins' Cloudify functionality is done differently depending on whether your Jenkins project
is a freestyle project or a pipeline project (more commonly used nowadays).

When using a build step through a freestyle job, you need to provide the ID of a credenetials entry. Usually, you would prefer to
receive this ID through a job parameter, in which case you can use Jenkins' standard parameters expansion syntax. For example:
`${cfy_credentials}` will return the value of a job parameter named `cfy_credentials`.

When using a build step through a pipeline, there are two ways to provide credentials:

* Through the `credentialsId` parameter, which receives the ID of a credentials entry (with similar semantics to using a step
in freestyle jobs, as described above). Note that, at the moment, this method can't be used with user-scoped credentials.

* by providing the `username` and `password` parameters. This is useful when you can't use the `credentialsId` parameter, or
when you prefer to use the traditional `withCredentials` syntax, which exports the username and password to variables. For example:

```
withCredentials([usernamePassword(credentialsId: "${params.cfy_credentials}", usernameVariable: 'CFY_USERNAME', passwordVariable: 'CFY_PASSWORD')]) {
    deleteCloudifyEnv username: "${CFY_USERNAME}",
        password: "${CFY_PASSWORD}",
        ...
        ...
}
```

## Available Build Steps: Basic

### Upload Cloudify Plugin

Use this build-step to upload a plugin to Cloudify Manager.

### Upload Cloudify Blueprint

This build-step uploads a blueprint to Cloudify Manager. The blueprint source may be provided as either:

* Path to a directory on the local filesystem
* Path to an archive on the local filesystem
* A URL to a `tar.gz` file

In addition, the blueprint's main YAML file must be provided.

### Delete Cloudify Blueprint

Use this build-step to delete a blueprint from Cloudify Manager by its ID.

### Build Cloudify Environment

Use this build-step to create a Cloudify deployment.

### Delete Cloudify Environment

Use this build-step to delete a Cloudify deployment.

### Execute Cloudify Workflow

Use this build-step to execute a workflow on a deployment.

### Convert Cloudify Environment Outputs/Capabilities to Inputs

Use this build-step to transform a Deployment Outputs File to a standard Deployment Inputs File
(see "Inputs Mapping File" above).

## Available Build Steps: Provisioners and Orchestrators

The plugin provides build-steps to facilitate the usage of popular provisioners and orchestrators, allowing
job/pipeline authors to use such tools through Cloudify in a seamless manner.

### Run Ansible Playbook

This build step receives the path / URL of an Ansible playbook, along with other context parameters, and runs it using
Cloudify's official Ansible plugin.

Prerequisites:

* Cloudify's Ansible Plugin installed on Cloudify Manager

### Create Azure ARM Deployment

This build step receives the path / URL of an Azure ARM template, and template parameters. The template is then
deployed on Azure, using Cloudify's Azure plugin.

*Prerequisites:*

* Cloudify's Azure Plugin installed on Cloudify Manager

*Notes:*

Certain parameters may be omitted, in which case the value will default to Cloudify secrets:

| Omitted Value   | Cloudify Secret Used as Default |
|-----------------|---------------------------------|
| Subscription ID | `azure_subscription_id`      |
| Tenant ID       | `azure_tenant_id`             |
| Client ID       | `azure_client_id`             |
| Client Secret   | `azure_client_secret`        |
| Location        | `azure_default_location`     |

### Create CloudFormation Stack

This build step receives the path / URL of an AWS CloudFormation template, as well as template parameters,
and creates a CloudFormation Stack off it, using Cloudify's AWS plugin.

Prerequisites:

* Cloudify's AWS Plugin installed on Cloudify Manager

*Notes:*

Certain parameters may be omitted, in which case the value will default to Cloudify secrets:

| Omitted Value     | Cloudify Secret Used as Default |
|-------------------|---------------------------------|
| Access Key ID     | `aws_access_key_id`           |
| Secret Access Key | `aws_secret_access_key`      |
| Region Name       | `aws_region_name`             |

### Apply Terraform Module

This build step receives the path / URL of a Terraform module, as well as module variables, and
applies the module, using Cloudify's Terraform plugin.

Prerequisites:

* Cloudify's Terraform Plugin installed on Cloudify Manager
* Terraform installed

*Notes:*

Certain parameters may be omitted, in which case the value will default to Cloudify secrets:

| Omitted Value               | Cloudify Secret Used as Default |
|-----------------------------|---------------------------------|
| Terraform Executable        | `terraform_executable`       |
| Terraform Plugins Directory | `terraform_plugins_dir`      |
| Terraform Storage Directory | `terraform_storage_dir`      |

## Cloudify's Build Wrapper

The Cloudify Plugin for Jenkins also provides a Jenkins *Build Wrapper*. The wrapper provides a convenience
method for creating a Cloudify environment before the build, and destroying it afterwards.

The wrapper can be activated by checking the "Cloudify Environment" box under "Build Environment" during
job definition.
