---
layout: bt_wiki
title: Secret Storage
category: Blueprints
draft: false
weight: 1250

---

Secret storage is implemented inside the Cloudify PostgreSQL database, to provide a tenant-wide variable store for data that you do not want to expose in plain text in Cloudify blueprints. For example, you might not want to expose login credentials for a platform to all blueprint users.

For additional information about creating secrets, refer to the CLI documentation.

## Adding Secrets

You can add secrets to the secret storage repository for the tenant to which they are currently logged in using the following command:
```cfy secrets create ```


## Retrieving Data from a Tenant's Secret Storage

To retrieve data from a tenant's secret storage, use the following command:
```cfy secrets get SECRET-KEY```

