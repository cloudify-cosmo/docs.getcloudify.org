---
layout: bt_wiki
title: Using Secret Storage
category: Manager
draft: false
weight: 875
---

Secret storage provides a tenant-wide variable store for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform. When you use secrets, the plugins that you have uploaded, consume the secrets to provide credential values. To use secret storage, you must specify the path to it's repository when you create the blueprint. For more information, see the [get_secret]({{< relref "blueprints/spec-intrinsic-functions.md#get-secret" >}}) intrinsic function.