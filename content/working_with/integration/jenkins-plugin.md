+++
title = "Jenkins Plugin"
description = "Introduction to Jenkins' integration"
weight = 24
alwaysopen = false
+++

The Jenkins Plugin for {{< param product_name >}}, provided with version 5.0.5 onward, allows Jenkins authors to embed {{< param product_name >}} functions within jobs and pipelines, thus simplifying the usage of the {{< param cfy_manager_name >}} through Jenkins.

### Plugin contents

The plugin provides:

* Discrete build steps for basic {{< param product_name >}} functions (uploading / deleting blueprints, creating / deleting environments, workflow execution and so forth)
* A standard Jenkins _Build Wrapper_, a convenient enclosure for other build steps that sets up a {{< param product_name >}} environment before the main steps and deletes the environment afterwards
* Build steps for integration with other provisioning tools:
    * Azure ARM
    * AWS CloudFormation
    * Terraform
    * Ansible

## Prerequisites

Jenkins version: 2.222.4+

## Installation

The plugin can be installed like any other Jenkins plugin - through the official Jenkins Update Center
(using the Jenkins administration UI, or the Jenkins CLI).

### Installing in controlled environments

In certain environments, access to the public Jenkins Update Center is restricted. There are a few ways
to cope with it (such as using a custom Update Center configuration file), which are described in
Jenkins' documentation.

If you would like to install the {{< param product_name >}} Jenkins plugin directly, you can download the plugin file
(with `.hpi` extension) from Jenkins' Maven artifact repository: https://repo.jenkins-ci.org/

Our plugin's Group ID is `io.jenkins.plugins` and the Artifact ID is `cloudify`. You can therefore
browse the artifacts in this link: https://repo.jenkins-ci.org/releases/io/jenkins/plugins/cloudify/

## Examples

The Jenkins plugin repository contains a few examples of job definitions making use of features included in this plugin.
You can find them [here](https://github.com/cloudify-cosmo/jenkins-cloudify-plugin/tree/master/examples/jobs).

To import these definitions into Jenkins, use the Jenkins CLI. For example:

```bash
java -jar jenkins-cli.jar -s <jenkins_url> create-job <job_name> < path_to_job_xml_file
```

For example:

```bash
java -jar jenkins-cli.jar -s <jenkins_url> create-job <job_name> < examples/jobs/cloudify-wrapper-with-git.xml
```

## Terminology

NOTE: Refer to the general [CI/CD Integration](..) page for common {{< param product_name >}} concepts related
to CI/CD integration.

### Inputs Mapping File

Often, the outputs of a deployment (see "Deployment Outputs File" above) are used, in whole or in part, as inputs
to subsequent {{< param product_name >}} operations. This transformation can be accomplished in various {{< param product_name >}} build-steps
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
To install the plugin, download the HPI file from the [releases section](https://github.com/cloudify-cosmo/jenkins-cloudify-plugin/releases) and install it
via Jenkins' "Advanced" panel in the "Manage Plugins" section.

## Configuration

### {{< param cfy_manager_name >}} Endpoint

You should define the {{< param cfy_manager_name >}} endpoint in Jenkins' console ("Manage Jenkins" ->
"Configure System", look for {{< param cfy_manager_name >}}).

You can also specify {{< param product_name >}} tenant to use by default. If none is provided, then {{< param product_name >}}'s
default tenant (`default_tenant`) will be used.

**NOTE**: When using an SSL-secured {{< param cfy_manager_name >}}, the Manager's external-facing certificate must either be:

* Signed by a publicly-trusted CA; or
* Signed by a CA whose certificate exists in the JRE's trust store; or
* Imported (along with any intermediary certificates, if any) into the JRE's trust store

### Credentials

Most {{< param product_name >}}-related functionality requires credentials to operate. {{< param product_name >}} doesn't offer its own Jenkins credentials type; you should use
the standard, out-of-the-box "Username with Password" credentials type.

## General Usage Notes

### Passing Credentials

The passing of credentials to Jenkins' {{< param product_name >}} functionality is done differently depending on whether your Jenkins project
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

### Upload {{< param product_name >}} Plugin

Use this build-step to upload a plugin to {{< param cfy_manager_name >}}.

### Upload {{< param product_name >}} Blueprint

This build-step uploads a blueprint to {{< param cfy_manager_name >}}. The blueprint source may be provided as either:

* Path to a directory on the local filesystem
* Path to an archive on the local filesystem
* A URL to a `tar.gz` file

In addition, the blueprint's main YAML file must be provided.

### Delete {{< param product_name >}} Blueprint

Use this build-step to delete a blueprint from {{< param cfy_manager_name >}} by its ID.

### Build {{< param product_name >}} Environment

Use this build-step to create a {{< param product_name >}} deployment.

### Delete {{< param product_name >}} Environment

Use this build-step to delete a {{< param product_name >}} deployment.

### Execute {{< param product_name >}} Workflow

Use this build-step to execute a workflow on a deployment.

### Convert {{< param product_name >}} Environment Outputs/Capabilities to Inputs

Use this build-step to transform a Deployment Outputs File to a standard Deployment Inputs File
(see "Inputs Mapping File" above).

## Available Build Steps: Provisioners and Orchestrators

The plugin provides build-steps to facilitate the usage of popular provisioners and orchestrators, allowing
job/pipeline authors to use such tools through {{< param product_name >}} in a seamless manner.

### Run Ansible Playbook

This build step receives the path / URL of an Ansible playbook, along with other context parameters, and runs it using
{{< param product_name >}}'s official Ansible plugin.

Prerequisites:

* {{< param product_name >}}'s Ansible Plugin installed on {{< param cfy_manager_name >}}

### Create Azure ARM Deployment

This build step receives the path / URL of an Azure ARM template, and template parameters. The template is then
deployed on Azure, using {{< param product_name >}}'s Azure plugin.

*Prerequisites:*

* {{< param product_name >}}'s Azure Plugin installed on {{< param cfy_manager_name >}}

*Notes:*

Certain parameters may be omitted, in which case the value will default to {{< param product_name >}} secrets:

| Omitted Value   | {{< param product_name >}} Secret Used as Default |
|-----------------|---------------------------------|
| Subscription ID | `azure_subscription_id`      |
| Tenant ID       | `azure_tenant_id`             |
| Client ID       | `azure_client_id`             |
| Client Secret   | `azure_client_secret`        |
| Location        | `azure_default_location`     |

### Create CloudFormation Stack

This build step receives the path / URL of an AWS CloudFormation template, as well as template parameters,
and creates a CloudFormation Stack off it, using {{< param product_name >}}'s AWS plugin.

Prerequisites:

* {{< param product_name >}}'s AWS Plugin installed on {{< param cfy_manager_name >}}

*Notes:*

Certain parameters may be omitted, in which case the value will default to {{< param product_name >}} secrets:

| Omitted Value     | {{< param product_name >}} Secret Used as Default |
|-------------------|---------------------------------|
| Access Key ID     | `aws_access_key_id`           |
| Secret Access Key | `aws_secret_access_key`      |
| Region Name       | `aws_region_name`             |

### Apply Terraform Module

This build step receives the path / URL of a Terraform module, as well as module variables, and
applies the module, using {{< param product_name >}}'s Terraform plugin.

Prerequisites:

* {{< param product_name >}}'s Terraform Plugin installed on {{< param cfy_manager_name >}}
* Terraform installed

*Notes:*

Certain parameters may be omitted, in which case the value will default to {{< param product_name >}} secrets:

| Omitted Value               | {{< param product_name >}} Secret Used as Default |
|-----------------------------|---------------------------------|
| Terraform Executable        | `terraform_executable`       |
| Terraform Plugins Directory | `terraform_plugins_dir`      |
| Terraform Storage Directory | `terraform_storage_dir`      |

## Cloudify's Build Wrapper

The {{< param product_name >}} Plugin for Jenkins also provides a Jenkins *Build Wrapper*. The wrapper provides a convenience
method for creating a {{< param product_name >}} environment before the build, and destroying it afterwards.

The wrapper can be activated by checking the "{{< param product_name >}} Environment" box under "Build Environment" during
job definition.
