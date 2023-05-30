---
title: "Exposing SubManager via CLI"
description: "Exposing SubManager via CLI"
weight: 105
alwaysopen: false
---

#### Installation via {{< param cfy_cli_name >}}.

To proceed with CLI installation, refer to [official documentation](https://docs.cloudify.co/latest/cli/orch_cli/).

[Upload the blueprint](https://docs.cloudify.co/latest/cli/orch_cli/blueprints/) and then install it.
There are two ways to install:
- [Create deployment](https://docs.cloudify.co/latest/cli/orch_cli/deployments/) and next [start install workflow with executions](https://docs.cloudify.co/latest/cli/orch_cli/executions/)
- [install command](https://docs.cloudify.co/latest/cli/orch_cli/install/)

### Verification of Installation
The status of installation can be checked via [***cfy deployments list***](https://docs.cloudify.co/latest/cli/orch_cli/deployments/) command.
The deployment should be visible on list.
