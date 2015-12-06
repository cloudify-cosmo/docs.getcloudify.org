---
layout: bt_wiki
title: Python Client
category: APIs
draft: false
abstract: REST Client API Documentation for the Cloudify Manager
weight: 400
---

{{% gsSummary %}}
In this section you will find information about our python API client.
Read our <a href="http://cloudify-rest-client.readthedocs.org/en/3.2/" target="_blank">technical documentation</a> for more information
{{% /gsSummary %}}


# Python Client

To use this client run the command `pip install  cloudify-rest-client==3.2.0` or add it to your dependencies file.

Here is an example of how to get blueprints

{{< gsHighlight  python  >}}

from cloudify_rest_client import CloudifyClient

client = CloudifyClient('http://MANAGER_HOST')
blueprints = client.blueprints.list()

for blueprint in blueprints:
print blueprint.id

{{< /gsHighlight >}}