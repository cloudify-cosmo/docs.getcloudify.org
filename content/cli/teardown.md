---
layout: bt_wiki
title: teardown
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 220
---

The `cfy teardown` command is used to teardown a manager and all resources attached to it.

{{% gsNote title="Note" %}}
The teardown process will remove the manager VM and any security groups, ip addresses, key pairs which were provisioned during the bootstrap process. It's important to note that if you used the simple-manager-blueprint to bootstrap a manager, no resources will be deleted but the manager will become non-functional after tearing it down.
{{% /gsNote %}}


Usage: `cfy teardown [options] -f`

Teardown a manager.

#### Required flags

* `-f, --force` - This flag is mandatory to perform the teardown. Note that if there are running deployments on the manager, the `--ignore-deployments` flag must also be passed to perform the teardown.

#### Optional flags

* `--ignore-deployments` - Teardown even if there are existing deployments on the manager. Note that ignoring deployments should be used with care as the manager controlling any resources provisioned by it (i.e. running deployments) will not be removed. It will be up to the user to remove those unecessary resources. 