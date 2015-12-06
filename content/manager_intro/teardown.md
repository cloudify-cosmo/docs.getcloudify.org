---
layout: bt_wiki
title: Tearing Down
category: Manager Intro
draft: false
weight: 800
---

It's also possible to delete the Manager and its accompanying resources (the servers, networks, security groups and any other resourcs that were configured within the Manager blueprint).

This can be done by issuing the following command:

{{< gsHighlight  bash  >}}
cfy teardown -f
{{< /gsHighlight >}}

This will terminate the manager VM and delete the resources associated with it.

# So What Now?

* You can now [write your own plugin](plugins-authoring.html) to be able to utilize tools of your chooseing via Cloudify.
* Product Overview will provide you with deeper understanding on how Cloudify is built.