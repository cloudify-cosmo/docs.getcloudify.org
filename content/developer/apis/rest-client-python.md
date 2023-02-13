---
title: Python Client
category: APIs
draft: false
weight: 400
aliases: /apis/rest-client-python/
---

# Installing the Python Client

To use this client run the command `pip install cloudify-rest-client==6.4.0` or add it to your dependencies file.

# Using the Python Client

For more information about using the Python client, see the [Python client documentation]({{< relref "developer/apis/rest-client-python-ref.html" >}}).

Here is an example of how to get blueprints:

{{< highlight python >}}
from cloudify_rest_client import CloudifyClient

client = CloudifyClient('http://MANAGER_HOST')
blueprints = client.blueprints.list()

for blueprint in blueprints:
print blueprint.id
{{< /highlight >}}
