---
layout: bt_wiki
title: Secret Storage
category: Blueprints
draft: false
weight: 1250

---

A secrets store is implemented inside the Cloudify PostgreSQL database to provide tenant-wide variable storage for data that you do not want to expose in plain text in Cloudify blueprints. For example, you might not want to expose login credentials for a platform to all blueprint users.

For additional information about creating secrets, refer to the [CLI documentation]({{< relref "cli/secrets.md" >}}).

## Adding Secrets

You can add secrets to the secrets store repository for the tenant to which they are currently logged in using the following command:
```cfy secrets create ```


## Retrieving Data from a Tenant's Secrets Store

To retrieve data from a tenant's secrets store, use the following command:
```cfy secrets get SECRET-KEY```

