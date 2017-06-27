---
layout: bt_wiki
title: Using the Secrets Store
category: Manager
draft: false
weight: 875
---

The secrets store provides a tenant-wide variable storage for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform. To use the secrets store, you must specify the path to it's repository when you create the blueprint. For more information, see the [get_secret]({{< relref "blueprints/spec-intrinsic-functions.md#get-secret" >}}) intrinsic function.