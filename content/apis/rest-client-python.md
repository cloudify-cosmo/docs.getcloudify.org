---
layout: bt_wiki
title: Python Client
category: APIs
draft: false
weight: 400
---

In this section you will find information about our python API client.
Read our [technical documentation](http://cloudify-rest-client.readthedocs.org/en/3.3/) for more information

# Python Client

To use this client run the command `pip install cloudify-rest-client==4.1` or add it to your dependencies file.

Here is an example of how to get blueprints

{{< gsHighlight python >}}
from cloudify_rest_client import CloudifyClient

client = CloudifyClient('http://MANAGER_HOST')
blueprints = client.blueprints.list()

for blueprint in blueprints:
print blueprint.id
{{< /gsHighlight >}}
