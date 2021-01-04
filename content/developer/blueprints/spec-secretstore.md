---
layout: bt_wiki
title: Secrets Store
category: Blueprints
draft: false
weight: 1250
aliases: /blueprints/spec-secretstore/
---

The secrets store is implemented inside the {{< param product_name >}} PostgreSQL database, to provide tenant-wide variable storage for data that you do not want to expose in plain text in blueprints. For example, you might not want to expose login credentials for a platform to all blueprint users.

For additional information about creating secrets, refer to the [CLI documentation]({{< relref "cli/orch_cli/secrets.md" >}}).

## Adding Secrets

You can add secrets to the secrets store repository for the tenant to which you are currently logged in using the following command:

```
cfy secrets create
```


## Retrieving Data from the Secrets Store of a Tenant

To retrieve data from a tenant's secrets store, use the following command:

```
cfy secrets get SECRET-KEY
```
