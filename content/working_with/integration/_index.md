---
title: CI/CD Integration
description:
weight: 90
alwaysopen: false
---

{{< param product_name >}} provides integration with various CI/CD platforms.

{{%children style="h3" description="true"%}}

# The `cli` Docker Image

With the exception of Jenkins, the integration between CI/CD tools and {{< param product_name >}} is encapsulated
in a [Docker image](https://hub.docker.com/r/cloudifyplatform/cloudify-cli). The Docker image
contains the standard {{< param cfy_cli_name >}}, as well as a wrapper script (called `cfyci`) that provides a few
shortcuts and sugaring for simplified {{< param product_name >}} access.

# Specifying {{< param cfy_manager_name >}} Access

_(This section does not apply to the Jenkins plugin)_

When using the standard C{{< param cfy_cli_name >}}, the user is required to create a CLI profile, describing the location
of the {{< param cfy_manager_name >}} as well as credentials. This is traditionally done by using the `cfy profiles` command:

```bash
cfy profiles use cloudify-host -u admin -p password -t default_tenant
```

In order to simplify working in CI/CD platforms, the `cfyci` utility handles profile creation
automatically by inquiring your job's environment variables. That way, users of
the {{< param product_name >}} CI/CD integration need not worry about creating a profile; `cfyci` does this for you.

The following environment variables are used:

| Environment Variable | Purpose
|----------------------|--------
| `CLOUDIFY_HOST`      | Host name / IP address of the {{< param cfy_manager_name >}}
| `CLOUDIFY_USERNAME`  | Username for {{< param cfy_manager_name >}} authentication
| `CLOUDIFY_PASSWORD`  | Password for {{< param cfy_manager_name >}} authentication
| `CLOUDIFY_TENANT`    | {{< param cfy_manager_name >}} tenant to operate on (defaults to `default_tenant`)
| `CLOUDIFY_SSL`       | `false` for non-SSL connectivity; any other value is considered as `true`, which is also the default)
| `CLOUDIFY_TOKEN`     | Authentication token for {{< param cfy_manager_name >}}

{{% note title="Note" %}}
to make use of ``CLOUDIFY_TOKEN`` you must not set ``CLOUDIFY_USERNAME`` and ``CLOUDIFY_PASSWORD``
{{% /note %}}

In addition, you can define the `CLOUDIFY_SSL_TRUST_ALL` environment variable as
`true` in order to bypass certificate verification. Note that this is generally a bad
idea, especially in production environments.

# Common Inputs

_(This section does not apply to the Jenkins plugin)_

The following inputs are widely used across the {{< param product_name >}} CI/CD integration features:

| Input Name     | Description |
|-------------------|---------------------------------|
| `environment-name`     | Name of {{< param product_name >}} environment to create, delete or use. This maps to a {{< param product_name >}} Deployment ID. |
| `outputs-file` | Path to environment's outputs and capabilities file (see [below](#environment-outputs-and-capabilities-file)).

# Default Input Values

_(This section does not apply to the Jenkins plugin)_

Occasionally, the value "`-`" is used as a default value for string parameters. This is done in order to simplify the construction of command
lines.

# Environment Outputs and Capabilities File

Certain CI/CD operations (such as "create environment") can generate a JSON file containing the {{< param product_name >}} Environment's
outputs and capabilities. This file can be used by subsequent steps, for the purpose of carrying out
the rest of the CI/CD cycle (for example: obtaining the IP address of a created server).

The structure of the JSON file is as follows:

```json
{
  "blueprint_id": "<blueprint_id>",
  "deployment_id": "<deployment_id>",
  "outputs": {
    "output_1": "output_value_1",
    "output_2": "output_value_2",
    ...
  },
  "capabilities": {
    "cap_1": "cap_1",
    "cap_2": "cap_2",
    ...
  }
}
```

* `blueprint_id` contains the ID of the blueprint from which the environment was created.
* `deployment_id` contains the {{< param product_name >}} deployment ID for the environment.
* `outputs` is a key-value dictionary, mapping output names to values, as would be
  returned by the `cfy deployments outputs` command.
* `capabilities` is a key-value dictionary, mapping capability names to values, as would be
  returned by the `cfy deployments capabilities` command.

The popular `jq` utility (included with the {{< param cfy_cli_name >}} Docker image) can be used to parse the file. For example, if the output file is set
to `env-data.json`, the following will extract the value of `output_2`:

```bash
jq ".outputs.output_2" < env-data.json
```
