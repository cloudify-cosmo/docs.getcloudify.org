---
layout: bt_wiki
title: Tearing Down
category: Manager Intro
draft: false
weight: 900
---

It's also possible to delete the Manager and its accompanying resources (the servers, networks, security groups and any other resourcs that were configured within the Manager blueprint).

This can be done by issuing the following command:

{{< gsHighlight  bash  >}}
cfy teardown -f
{{< /gsHighlight >}}

This will terminate the manager VM and delete the resources associated with it.
